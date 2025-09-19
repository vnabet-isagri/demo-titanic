import { defineEventHandler } from 'h3'

type Params = {
    page: string;
    limit: string;
    name:string;
    survived: string;
    orderby: string;
    order: 'ASC' | 'DESC';
}

export default defineEventHandler(async (event) => {

    const params = getQuery(event) as Partial<Params>;
    //console.log(params);

    const db = useDatabase();

/*    const {rows} = await db.sql`PRAGMA table_info(passengers);`;
console.log(rows);*/

    const statment = db.prepare(`SELECT * from passengers` + getNameQuery(params) + getSurvivedQuery(params) + getOrderByQuery(params) + getPageQuery(params));

    return await statment.all();
})

function getNameQuery(params: Partial<Params>) {

    if(params.name) {
        return ` WHERE name LIKE '%${params.name}%' `;
    }
    return '';
}

function getPageQuery(params: Partial<Params>) {
    if(params.page > 0 && params.limit > 0) {
        const offset = (params.page - 1) * params.limit;
        return ` LIMIT ${params.limit} OFFSET ${offset} `;
    }
    return '';
}

function getSurvivedQuery(params: Partial<Params>) {
    if(params.survived !== undefined) {
        return params.survived === '1' ? ' AND survived = 1 ' : ' AND survived = 0 ';
    }
    return '';
}

function getOrderByQuery(params: Partial<Params>) {
    if(params.orderby) {
        const order = params.order === 'DESC' ? 'DESC' : 'ASC';
        return ` ORDER BY ${params.orderby} ${order} `;
    }
    return '';
}
