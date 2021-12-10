import { database } from "../../database/database";
import { IQueryResponse, IToken } from "../../interfaces/postgres_responses";

class TokensRepository {
  private table: string = "tokens";

  public create = async (
    token: string,
    refreshToken: string
  ): Promise<IQueryResponse> => {
    return database
      .query(
        `insert into ${this.table}(token, refresh_token) values('${token}', '${refreshToken}') RETURNING *`
      )
      .then((value) => {
        return {
          ok: true,
          data: value.rows[0],
        };
      })
      .catch((err) => {
        console.log(err);
        return {
          ok: false,
          data: err.message,
        };
      });
  };

  public getByToken = async (refreshToken: string): Promise<IQueryResponse> => {
    return database
      .query(
        `SELECT * FROM ${this.table} WHERE refresh_token = '${refreshToken}'`
      )
      .then((value) => {
        console.log(value.rows.length);
        if (value.rows.length == 0) {
          return {
            ok: false,
            data: "token not found",
          };
        }

        return {
          ok: true,
          data: value.rows[0],
        };
      })
      .catch((err) => {
        console.log(err);
        return {
          ok: false,
          data: err.message,
        };
      });
  };
}

export const tokensRepository = new TokensRepository();
