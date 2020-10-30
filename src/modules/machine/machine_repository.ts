import { IQueryResponse } from '../../interfaces/postgres_responses';
import { database } from '../../database/database';

class MachineRepository {

    public update = async(id: string): Promise<IQueryResponse> => {

        return database.query(
            `UPDATE users SET requests = requests + 1 WHERE id = '${id}' RETURNING *`
        ).then(async(value) => {
        
            if(value.rowCount === 0) return {
                ok: false,
                data: 'User not found'
            }

            return {
                ok: true,
                data: value.rows[0]
            }
        }).catch((err) => {
            return {
                ok: false,
                data: err.message
            }
        });
    }
}

export const machineRepository = new MachineRepository;
