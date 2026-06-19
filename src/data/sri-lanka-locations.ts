export interface SriLankaSubArea {
  name: string
  postalCode?: string
}

export interface SriLankaTown {
  name: string
  subAreas: SriLankaSubArea[]
}

export interface SriLankaProvince {
  name: string
  towns: SriLankaTown[]
}

export const SRI_LANKA_LOCATIONS: SriLankaProvince[] = [
  {
    name: 'Western Province',
    towns: [
      {
        name: 'Colombo',
        subAreas: [
          { name: 'Colombo 01', postalCode: '00100' },
          { name: 'Colombo 02', postalCode: '00200' },
          { name: 'Colombo 03', postalCode: '00300' },
          { name: 'Colombo 04', postalCode: '00400' },
          { name: 'Colombo 05', postalCode: '00500' },
          { name: 'Colombo 06', postalCode: '00600' },
          { name: 'Colombo 07', postalCode: '00700' },
          { name: 'Colombo 08', postalCode: '00800' },
          { name: 'Colombo 09', postalCode: '00900' },
          { name: 'Colombo 10', postalCode: '01000' },
          { name: 'Colombo 11', postalCode: '01100' },
          { name: 'Colombo 12', postalCode: '01200' },
          { name: 'Colombo 13', postalCode: '01300' },
          { name: 'Colombo 14', postalCode: '01400' },
          { name: 'Colombo 15', postalCode: '01500' },
          { name: 'Borella' },
          { name: 'Thimbirigasyaya' },
          { name: 'Wellawatta' },
        ],
      },
      {
        name: 'Nugegoda',
        subAreas: [
          { name: 'Nugegoda Town', postalCode: '10250' },
          { name: 'Pamankada' },
          { name: 'Kirisula' },
          { name: 'Udahamulla' },
        ],
      },
      {
        name: 'Dehiwala',
        subAreas: [
          { name: 'Dehiwala Town', postalCode: '10350' },
          { name: 'Mount Lavinia', postalCode: '10370' },
          { name: 'Ratmalana', postalCode: '10390' },
          { name: 'Kohuwala' },
        ],
      },
      {
        name: 'Maharagama',
        subAreas: [
          { name: 'Maharagama Town', postalCode: '10280' },
          { name: 'Pepiliyana' },
          { name: 'Mirihana' },
          { name: 'Godagama' },
        ],
      },
      {
        name: 'Kaduwela',
        subAreas: [
          { name: 'Kaduwela Town', postalCode: '10640' },
          { name: 'Battaramulla', postalCode: '10120' },
          { name: 'Koswatta' },
          { name: 'Malabe' },
        ],
      },
      {
        name: 'Homagama',
        subAreas: [
          { name: 'Homagama Town', postalCode: '10200' },
          { name: 'Panagoda' },
          { name: 'Pannipitiya' },
        ],
      },
      {
        name: 'Negombo',
        subAreas: [
          { name: 'Negombo Town', postalCode: '11500' },
          { name: 'Kochchikade' },
          { name: 'Kattuwa' },
          { name: 'Dalupotha' },
        ],
      },
      {
        name: 'Gampaha',
        subAreas: [
          { name: 'Gampaha Town', postalCode: '11000' },
          { name: 'Yakkala' },
          { name: 'Weliweriya' },
          { name: 'Udugampola' },
        ],
      },
      {
        name: 'Kalutara',
        subAreas: [
          { name: 'Kalutara Town', postalCode: '12000' },
          { name: 'Beruwala', postalCode: '12070' },
          { name: 'Aluthgama', postalCode: '12080' },
          { name: 'Wadduwa' },
        ],
      },
    ],
  },
  {
    name: 'Central Province',
    towns: [
      {
        name: 'Kandy',
        subAreas: [
          { name: 'Kandy City', postalCode: '20000' },
          { name: 'Peradeniya' },
          { name: 'Katugastota' },
          { name: 'Gampola' },
        ],
      },
      {
        name: 'Matale',
        subAreas: [
          { name: 'Matale Town', postalCode: '21000' },
          { name: 'Dambulla', postalCode: '21100' },
          { name: 'Sigiriya' },
        ],
      },
      {
        name: 'Nuwara Eliya',
        subAreas: [
          { name: 'Nuwara Eliya Town', postalCode: '22200' },
          { name: 'Talawakelle' },
          { name: 'Hatton' },
        ],
      },
    ],
  },
  {
    name: 'Southern Province',
    towns: [
      {
        name: 'Galle',
        subAreas: [
          { name: 'Galle Fort', postalCode: '80000' },
          { name: 'Galle Town' },
          { name: 'Unawatuna' },
          { name: 'Hikkaduwa' },
        ],
      },
      {
        name: 'Matara',
        subAreas: [
          { name: 'Matara Town', postalCode: '81000' },
          { name: 'Weligama' },
          { name: 'Mirissa' },
        ],
      },
      {
        name: 'Hambantota',
        subAreas: [
          { name: 'Hambantota Town', postalCode: '82000' },
          { name: 'Tangalle' },
          { name: 'Tissamaharama' },
        ],
      },
    ],
  },
  {
    name: 'Eastern Province',
    towns: [
      {
        name: 'Trincomalee',
        subAreas: [
          { name: 'Trincomalee Town', postalCode: '31000' },
          { name: 'Nilaveli' },
          { name: 'Uppuveli' },
        ],
      },
      {
        name: 'Batticaloa',
        subAreas: [
          { name: 'Batticaloa Town', postalCode: '30000' },
          { name: 'Kattankudy' },
          { name: 'Eravur' },
        ],
      },
    ],
  },
  {
    name: 'North Western Province',
    towns: [
      {
        name: 'Kurunegala',
        subAreas: [
          { name: 'Kurunegala Town', postalCode: '60000' },
          { name: 'Kuliyapitiya' },
          { name: 'Narammala' },
        ],
      },
      {
        name: 'Puttalam',
        subAreas: [
          { name: 'Puttalam Town', postalCode: '61300' },
          { name: 'Chilaw' },
          { name: 'Wennappuwa' },
        ],
      },
    ],
  },
  {
    name: 'Sabaragamuwa Province',
    towns: [
      {
        name: 'Ratnapura',
        subAreas: [
          { name: 'Ratnapura Town', postalCode: '70000' },
          { name: 'Embilipitiya' },
          { name: 'Balangoda' },
        ],
      },
      {
        name: 'Kegalle',
        subAreas: [
          { name: 'Kegalle Town', postalCode: '71000' },
          { name: 'Mawanella' },
          { name: 'Warakapola' },
        ],
      },
    ],
  },
]

export function getAllSubAreaSuggestions(): { id: string; name: string; province: string; town: string; subArea: string; postalCode?: string }[] {
  const result: { id: string; name: string; province: string; town: string; subArea: string; postalCode?: string }[] = []
  let id = 1
  for (const province of SRI_LANKA_LOCATIONS) {
    for (const town of province.towns) {
      for (const subArea of town.subAreas) {
        result.push({
          id: `lk-${id++}`,
          name: `${subArea.name}, ${town.name}`,
          province: province.name,
          town: town.name,
          subArea: subArea.name,
          postalCode: subArea.postalCode,
        })
      }
    }
  }
  return result
}
