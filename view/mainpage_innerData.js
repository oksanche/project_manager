 //Автор: Худорожникова Мария
 
 // Возвращает cookie с именем name, если есть, если нет, то undefined
 function getCookie(name) {
     var matches = document.cookie.match(new RegExp(
         "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
     ));
     return matches ? decodeURIComponent(matches[1]) : undefined;
 }
// Заполнить имя и фамилию пользователя на главной странице( mainpage.html)
 function innerData() {
     document.getElementById('username').innerHTML = getCookie("username");
 }