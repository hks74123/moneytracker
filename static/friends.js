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

get_friends()

async function get_friends(){
    let response = await fetch('/frienddetailedapi')
    if (response.ok) {
      let json = await response.json();
      let message = json['message'];
      if (message == 'success'){
      let share_data = json['data'];
      console.log(share_data)
      setfrienddata(share_data)
  }
  else {
      alert("HTTP-Error: " + response.status);
  }

  }
}

function setfrienddata(data){
    let data_len = data.length;
    const get_main_div = document.getElementById('transtable');
    for (var i=0;i<data_len;i++){
        const chileele = document.createElement('tr');
        get_main_div.appendChild(chileele);
        
        const friends_name = document.createElement('th')
        friends_name.innerText = data[i].friend_name;

        const friend_username = document.createElement('th')
        friend_username.innerText = data[i].friend_username

        const firend_common = document.createElement('th')
        firend_common.innerText = data[i].common

        const dues = document.createElement('th')
        dues.innerText = data[i].total_due

        chileele.appendChild(friends_name);
        chileele.appendChild(friend_username);
        chileele.appendChild(firend_common);
        chileele.appendChild(dues);
    }
}

function seeusers(){
    document.getElementById('trsnbtn').style.display='none';
    document.getElementById('transtable').style.display='none';
    document.getElementById('userstable').style.display='block';
    document.getElementById('requests').style.display='block';
    showusers();
}

async function showusers(){
    let response = await fetch('/moneytrackerusersapi')
    if (response.ok) {
      let json = await response.json();
      let message = json['message'];
      if (message == 'success'){
      let share_data = json['data'];
      console.log(share_data)
      setusersdata(share_data)
  }
  else {
      alert("HTTP-Error: " + response.status);
  }
    }
}

function setusersdata(data){
    let data_len = data.length;
    const get_main_div = document.getElementById('userstable');
    for (var i=0;i<data_len;i++){
        const chileele = document.createElement('tr');
        get_main_div.appendChild(chileele);
        
        const friends_name = document.createElement('th')
        friends_name.innerText = data[i].first_name+" "+data[i].last_name;

        const friend_username = document.createElement('th')
        friend_username.innerText = data[i].username

        const tele = document.createElement('th')
        const add_frnd = document.createElement('button')
        add_frnd.innerText = 'Add friend'
        add_frnd.id = `${data[i].username}`
        add_frnd.setAttribute('onclick', "add_friends('"+data[i].username+"')")

        tele.appendChild(add_frnd)

        const ele = document.createElement('th')
        const cancel = document.createElement('button')
        cancel.innerHTML = 'Request Sent';
        cancel.id = `c${data[i].username}`
        cancel.style.display='none'
        ele.appendChild(cancel)

        chileele.appendChild(friends_name);
        chileele.appendChild(friend_username);
        chileele.appendChild(tele);
        chileele.appendChild(ele);
}
}

async function add_friends(data){
    let response = await fetch('add_friends', {
        credentials: 'include',
        method: 'POST',
        mode: 'same-origin',
        headers: {
            'X-CSRFToken': csrftoken,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "usersname":data
        })
    })
    if (response.ok) {
        let json = await response.json();
        let message = json["message"];
        if(message=='success'){
            console.log(message);
            document.getElementById(data).style.display='none'
            document.getElementById('c'+data).style.display='inline-block';
        }else{
            alert(message);
        }
    } else {
        alert("HTTP-Error: " + response.status);
    }
}


function show_request(){
    document.getElementById('userstable').style.display='none'
    document.getElementById('friend_req').style.display = 'block';
    document.getElementById('requests').style.display='none';
    show_req()
}


async function show_req(){
    let response = await fetch('/get_friend_request')
    if (response.ok) {
      let json = await response.json();
      let message = json['message'];
      if (message == 'success'){
      setfriend_req(json['data'])
  }
  else {
      alert("HTTP-Error: " + response.status);
  }

  }
}

function setfriend_req(data){
    let data_len = data.length;
    const get_main_div = document.getElementById('friend_req');
    for (var i=0;i<data_len;i++){
        const chileele = document.createElement('tr');
        get_main_div.appendChild(chileele);
        
        const friends_name = document.createElement('th')
        friends_name.innerText = data[i].full_name;

        const friend_username = document.createElement('th')
        friend_username.innerText = data[i].username

        const firend_common = document.createElement('th')
        const btn = document.createElement('button')
        btn.id = `${data[i].username}`
        btn.innerText = 'Accept'
        btn.setAttribute('onclick',"accept('"+data[i].id+"')")
        firend_common.appendChild(btn)

        const ee = document.createElement('th')

        const btn1 = document.createElement('button')
        btn1.id = `d${data[i].username}`
        btn1.innerText = 'Delete'
        btn1.setAttribute('onclick',"delee('"+data[i].id+"')")
        ee.appendChild(btn1)


        chileele.appendChild(friends_name);
        chileele.appendChild(friend_username);
        chileele.appendChild(firend_common);
        chileele.appendChild(ee)
}
}

async function accept(data){
    let response = await fetch('addfriend', {
        credentials: 'include',
        method: 'POST',
        mode: 'same-origin',
        headers: {
            'X-CSRFToken': csrftoken,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "id":data
        })
    })
    if (response.ok) {
        let json = await response.json();
        let message = json["message"];
        if(message=='success'){
            console.log(message);
            window.location.href = '/friends';
        }else{
            alert(message);
        }
    } else {
        alert("HTTP-Error: " + response.status);
    }

}


async function delee(data){
    let response = await fetch('remfriend', {
        credentials: 'include',
        method: 'POST',
        mode: 'same-origin',
        headers: {
            'X-CSRFToken': csrftoken,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "id":data
        })
    })
    if (response.ok) {
        let json = await response.json();
        let message = json["message"];
        if(message=='success'){
            console.log(message);
            window.location.href = '/friends';
        }else{
            alert(message);
        }
    } else {
        alert("HTTP-Error: " + response.status);
    }

}