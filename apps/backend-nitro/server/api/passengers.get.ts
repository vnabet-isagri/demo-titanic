import { defineEventHandler} from 'h3'

/**
 * Type représentant les paramètres de la requête
 */
type Params = {
    page: string;
    limit: string;
    name:string;
    survived: string;
    orderby: string;
    order: 'ASC' | 'DESC';
}

/**
 * Informations de pagination
 */
type Pagination = {
    page: number;
    limit: number;
    total: number;
}

/**
 * Handler de la requête
 */
export default defineEventHandler(async (event) => {

    const params = getQuery(event) as Partial<Params>;

    const db = useDatabase();

    const statment = db.prepare(`SELECT * from passengers` + getWhereQuery(params) + getOrderByQuery(params) + getPageQuery(params));

    const data = await statment.all() as unknown[];

    let pagination:Partial<Pagination> | null = null;

    if(data.length) {
        pagination = await getPagination(params, db);
        if(pagination) pagination.limit = parseInt(params?.limit ?? '');
    }

    if(pagination) {
        return {
            data,
            page: pagination?.page,
            limit: pagination?.limit,
            total: pagination?.total

        }
    }
    return data;
})

/**
 * Construit lz filtre de recherche par nom
 * @param params
 */
function getNameQuery(params: Partial<Params>) {

    if(params.name) {
        return `name LIKE '%${params.name}%' `;
    }
    return '';
}

/**
 * Construit la pagination
 * @param params
 */
function getPageQuery(params: Partial<Params>) {
    if(params.page > 0 && params.limit > 0) {
        const offset = (params.page - 1) * params.limit;
        return ` LIMIT ${params.limit} OFFSET ${offset} `;
    }
    return '';
}

/**
 * Construit le filtre de recherche sur les survivants
 * @param params
 */
function getSurvivedQuery(params: Partial<Params>) {
    if(params.survived !== undefined) {
        return params.survived === '1' ? 'survived = 1 ' : ' survived = 0 ';
    }
    return '';
}

/**
 * Construit l'ordre de la requête
 * @param params
 */
function getOrderByQuery(params: Partial<Params>) {
    if(params.orderby) {
        const order = params.order === 'DESC' ? 'DESC' : 'ASC';
        return ` ORDER BY ${params.orderby} ${order} `;
    }
    return '';
}

/**
 * Construit l'ensemble du filtre de recherche
 * @param params
 */
function getWhereQuery(params: Partial<Params>) {
    let whereQueries = [getNameQuery(params), getSurvivedQuery(params)];
    // filtre les chaînes vides
    whereQueries = whereQueries.filter(q => q.trim() !== '');

    if(whereQueries.length) {
        return ' WHERE ' + whereQueries.join(' AND ');
    }
    return '';
}

/**
 * Récupère les infos de pagination
 * @param params
 * @param db
 */
async function getPagination(params: Partial<Params>, db:any) {
    if(params?.page > 0 && params?.limit > 0) {
        const offset = (params.page - 1) * params.limit;
        const whereQuery = getWhereQuery(params);
        const query = `SELECT FLOOR((ROW_NUMBER() OVER (ORDER BY id) - 1) / ${params.limit}) + 1 AS page,
                                   (SELECT COUNT(*) FROM passengers ${whereQuery}) AS total
                            FROM passengers ${whereQuery}
                            LIMIT 1 OFFSET ${offset}`;

        const statment = db.prepare(query);
        const pagination = await statment.get();

        return pagination
    }
    return null;
}
