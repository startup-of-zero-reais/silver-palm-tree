import { Apply } from '../domain/apply.entity';

export default interface ApplyFacadeInterface {
	findByJobId(id: string): Promise<Apply[]>;
}
