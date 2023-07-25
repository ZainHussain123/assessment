


const apiCall = async (url, method, body = null, isFormData = false) => {

    const headers = {
      Accept: 'application/json',
    };
  
    let requestOptions = {
      method: method,
      headers: headers,
    };
  
    if (body) {
      if (isFormData) {
        requestOptions.body = body;
      } else {
        headers['Content-Type'] = 'application/json';
        requestOptions.headers = headers;
        requestOptions.body = JSON.stringify(body);
      }
    }
  
    try {
      const response = await fetch(url, requestOptions);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      throw new Error('An error occurred during the API request');
    }
  };
  
  export default apiCall;
  