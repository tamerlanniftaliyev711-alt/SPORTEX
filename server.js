let URL = './db.json'

async function GetData(category) {
    const response = await fetch(URL);
    const data = await response.json();
    console.log(data);
    if(category) {
        return data[category] || [];
    }
    return Object.values(data).flat();
}

export default GetData;

