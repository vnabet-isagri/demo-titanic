export default defineEventHandler(async (event) => {
    //extrait les paramètres en get de la requête nitro
    const id = getRouterParam(event, 'id');

    const db = useDatabase();
    const {rows} = await db.sql`SELECT * FROM passengers where id = ${id}`;
    if(!rows?.[0]) {
        throw createError({ statusCode: 404, statusMessage: 'Passager non trouvé' });
    }
    return rows[0];
})
