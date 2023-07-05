"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvVars = void 0;
const sequelize_1 = require("sequelize");
class EnvVars extends sequelize_1.Model {
}
exports.EnvVars = EnvVars;
// export function EnvVarsFactory(sequelize: Sequelize) {
//     EnvVars.init({
//         apiKey: {
//             type: DataTypes.STRING,
//             primaryKey: true,
//             allowNull: false
//         }
//     })
// }
