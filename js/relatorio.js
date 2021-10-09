function extrairRelatorio(){
    // window.location.href = "http://localhost:5000/pacer/csvfile";
    axios.get('http://localhost:5000/pacer/csvfile');
}