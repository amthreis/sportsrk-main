// import IRepository from "./repositories/repo";
// import { MemRepository } from "./repositories/repo-mem";
// import { PrismaRepository } from "./repositories/repo-prisma";

// function getRepo() : IRepository {
//     if (process.env.NODE_ENV === "development")
//         return new PrismaRepository();
    
//     if (process.env.NODE_ENV === "test_e2e")
//         return new PrismaRepository("Prisma (e2e)");

//     //if (process.env.NODE_ENV === "test")
//     return new MemRepository();
// }

// const repo = getRepo();

// export default repo;