document.getElementById('Rgstr').addEventListener('click',usercheck);

async function usercheck() {
    document.getElementById('Rgstr').style.display='none';
    document.getElementById("f_name").disabled=true;
    document.getElementById("l_name").disabled=true;
    document.getElementById("u_name").disabled=true;
    document.getElementById("mmail").disabled=true;
    document.getElementById("pass").disabled=true;
    document.getElementById("pass1").disabled=true;
    document.getElementById('loadin_btn').style.display=''
    let response = await fetch('/register', {
        credentials: 'include',
        method: 'POST',
        mode: 'same-origin',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "first_name": document.getElementById("f_name").value,
            "last_name": document.getElementById("l_name").value,
            "username": document.getElementById("u_name").value,
            "email": document.getElementById("mmail").value,
            "password": document.getElementById("pass").value,
            "password_again": document.getElementById("pass1").value
        })
    })
    if(response.ok){
        let json = await response.json();
        let message = json["message"];
        if (message == 'success') {
            window.location.replace('/login');
    }
        else{
            document.getElementById("f_name").disabled=false;
            document.getElementById("l_name").disabled=false;
            document.getElementById("u_name").disabled=false;
            document.getElementById("mmail").disabled=false;
            document.getElementById("pass").disabled=false;
            document.getElementById("pass1").disabled=false;
            document.getElementById('loadin_btn').style.display='none';
            document.getElementById('Rgstr').style.display='';
            document.getElementById('msgbx').style.display='block';
            document.getElementById('msgbx').innerHTML=message;
        }
    }
    else{
        log='Server time out'
        document.getElementById("f_name").disabled=false;
        document.getElementById("l_name").disabled=false;
        document.getElementById("u_name").disabled=false;
        document.getElementById("mmail").disabled=false;
        document.getElementById("pass").disabled=false;
        document.getElementById("pass1").disabled=false;
        document.getElementById('loadin_btn').style.display='none';
        document.getElementById('Rgstr').style.display='';
        document.getElementById('msbx').style.display='block';
        document.getElementById('msgss').innerHTML=log;
    }
}


