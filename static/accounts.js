function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const csrftoken = getCookie('X-CSRFToken');
get_account_details();

async function get_account_details(){
    let response = await fetch('/accounsdetailapi')
    if (response.ok) {
      let json = await response.json();
      let message = json['message'];
      if (message == 'success'){
      setaccountdata(json['data'])
  }
  else {
      alert("HTTP-Error: " + response.status);
  }

  }
}

function setaccountdata(data){
    console.log(data)
    let data_len = data.length;
    for (var i=0;i<data_len;i++){
    document.getElementById('user_name').value = data[i].user.username
    document.getElementById('budgt').value = data[i].budget
    document.getElementById('spnd').value = data[i].spend}
}