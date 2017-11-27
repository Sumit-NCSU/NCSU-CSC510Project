const {Wit, log} = require('node-wit');

const client = new Wit({accessToken: 'HZXN5QJIZOGNUOE3OZD2VOHXGR7XAEHN'});
client.message('what are the details of Pull Request 20?', {})
.then((data) => {
  console.log(JSON.stringify(data));
})
.catch(console.error);


client.message('Can you merge the Pull request 20?', {})
.then((data) => {
  console.log(JSON.stringify(data));
})
.catch(console.error);


client.message('Issue a new Pull Request on repo abc and branch ert', {})
.then((data) => {
  console.log(JSON.stringify(data));
})
.catch(console.error);


client.message('List the details of the pull request 21.', {})
.then((data) => {
  console.log(JSON.stringify(data));
})
.catch(console.error);


client.message('Merge the Pull request 60 which is on repo abd, please!', {})
.then((data) => {
  console.log(JSON.stringify(data));
})
.catch(console.error);
