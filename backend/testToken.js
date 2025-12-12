// Test to verify token storage and retrieval
console.log('Current token in localStorage:', localStorage.getItem('token'));

// Test API call with token
fetch('http://localhost:8060/api/docs/my-documents', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  }
})
.then(response => {
  console.log('Response status:', response.status);
  return response.json();
})
.then(data => {
  console.log('Response data:', data);
})
.catch(error => {
  console.log('Error:', error);
});