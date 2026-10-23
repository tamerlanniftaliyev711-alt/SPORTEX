let URL = './db.json'

async function GetData(category) {
    const response = await fetch(URL);
    const data = await response.json();
    console.log(data);
    if(category) {
        return data.products[category] || [];
    }
    return Object.values(data.products).flat();
}

export default GetData;

