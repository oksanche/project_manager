// Автор: Худорожникова Мария

var cookies = document.cookie.split("; ");
		var value;
				
		for(var i=0; i<cookies.length; i++){
        
		var parts = cookies[i].split("=");
			if(parts[0].localeCompare("user") == 0) {
				value = parts[1];
			}
		}

		    if (value == "0") {
				document.getElementById("error").innerHTML = "Вы не вошли. Попробуйте еще раз.";
				document.cookie = "user=undefined; ";
				}