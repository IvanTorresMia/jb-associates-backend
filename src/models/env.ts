import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";

export class EnvVars extends Model<
  InferAttributes<EnvVars>,
  InferCreationAttributes<EnvVars>
> {
  declare apiKey: string;
  declare authDomain: string;
  declare projectId: string;
  declare storeBucket: string;
  declare messagingSenderId: string;
  declare appId: string;
  declare measurementId: string;
}

// export function EnvVarsFactory(sequelize: Sequelize) {
//     EnvVars.init({
//         apiKey: {
//             type: DataTypes.STRING,
//             primaryKey: true,
//             allowNull: false
//         }
//     })
// }
