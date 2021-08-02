const sendDataToServer = async ({route,reqMethod,reqBody}) => {
  console.log('body = ',reqBody);
    const url=`http://localhost:5000/${route}`;

    const response = await fetch(url, {
      method:reqMethod, // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reqBody) // body data type must match "Content-Type" header
    });
    const result={data:await response.json(),status:response.status};
    console.log(result);
    return result
  };

const getDataFromServer = async ({route,id,query,skip,limit}) => {
    skip = skip ? skip : 0;
    limit = limit ? limit : 0;
    query = query ? `${query}&skip=${skip}&limit=${limit}` : !id ? `?skip=${skip}&limit=${limit}` : '';
    id = id ? id : '';
    const url=`http://localhost:5000/${route}/${id}${query}`;
    console.log('URL=',url);
    const response = await fetch(url);
    const res=await response.json();
    console.log(res);
    return res
};

export {sendDataToServer,getDataFromServer}