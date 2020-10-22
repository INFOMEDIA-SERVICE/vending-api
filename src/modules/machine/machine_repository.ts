import { IQueryResponse } from 'models/postgres_responses';
import { database } from '../../database/database';

class MachineRepository {

    private table: string = 'clients';

    public updateClientsRequest = async(id: string):Promise<IQueryResponse> => {

        return database.query(`UPDATE ${this.table} SET request = request + 1 WHERE id = '${id}' AND status = true`)

        .then(async(value) => {
        
            if(value.rowCount === 0) return {
                ok: false,
                data: 'Client not found'
            }

            return {
                ok: true
            }
        })
        .catch((err) => {
            return {
                ok: false,
                data: err.message
            }
        });
    }
}

export const machineRepository: MachineRepository = new MachineRepository;
