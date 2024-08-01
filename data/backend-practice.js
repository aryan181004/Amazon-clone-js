// create object to receive/send data over internet
const xhr = new XMLHttpRequest();

/*
 *  make event listener before opening a request  
 */
// runs function after a event
// here event is respone is loaded
xhr.addEventListener('load', () => {
    console.log(xhr.response)
});

// open request
// url - universal resource location
// url path - https://supersimplebackend.dev"/hello"
/*
 * list of all supported paths
 * in documentation
 * called as backend api - application programming interface
*/
// get request
xhr.open('GET', 'https://supersimplebackend.dev/');
// send request
xhr.send();
// requires some time to get response 
// so doesnt wait here until received 
// but goto to next line 
// this is called asynchronous
// setTimeout setInterval are some example of asyncn code

