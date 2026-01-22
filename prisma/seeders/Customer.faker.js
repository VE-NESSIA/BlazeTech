import { faker } from "@faker-js/faker";

export async function seedCustomers(prisma, apiClientId, count = 10) {
const customers = [];

for (let i = 0; i < count; i++) {
    customers.push({
    id: faker.string.uuid(),
    name: faker.person.firstName()+ " "+ faker.person.lastName(),
    gender: faker.person.sex(['male', 'female']),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    address: JSON.stringify({ street: faker.location.streetAddress(), city: faker.location.city(), country: faker.location.country(['NG', 'GH', 'SN', 'SA', 'BURK', 'IC', 'KY']) }),
    national_id: faker.lorem.words(),
    risk_score: faker.number.int({ min: 0, max: 100 })
    })
}

await prisma.customer.createMany({ data: customers });

return prisma.customer.findMany({ where: { api_client_id: apiClientId } });
}
