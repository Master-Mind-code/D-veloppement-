import { Municipality } from '../../../../database/interfaces/postgresql';
import { MunicipalityOutput } from '../../../../database/models/postgresql/municipality';

const MunicipalityMapper = {
  toMunicipality: (municipality: MunicipalityOutput): Municipality => {
    if (!municipality) return municipality as unknown as Municipality;

    return {
      id: municipality.id,
      name: municipality.name,
      createdAt: municipality.createdAt,
      updatedAt: municipality.updatedAt,
      deletedAt: municipality.deletedAt,
    };
  },
};

export default MunicipalityMapper;
