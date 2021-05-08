var navBarItems;
var app = angular.module('navMenu', []);
    app.controller('navMenuCtrl', function ($scope) {
    $scope.userLoggedIn = (sessionStorage.getItem('userLoggedIn') === 'true');
    var rememberUser = (localStorage.getItem('rememberUser') === 'true');            
    if ($scope.userLoggedIn || rememberUser) {
        sessionStorage.setItem('userLoggedIn', "true");
        var loginHyp = document.getElementById('loginHyp');
        loginHyp.innerHTML = "Sign Out";
    }
        
    if (sessionStorage.getItem('showMenu') != 'none' && sessionStorage.getItem('showMenu') != 'block')
        sessionStorage.setItem('showMenu', 'none');
    
    navBarItems = document.getElementsByClassName('nav-menu')[0];
        
    if (sessionStorage.getItem('showMenu') == 'block') {
        navBarItems.classList.toggle('w3-animate-zoom');
        navBarItems.classList.toggle('w3-animate-opacity');
        document.getElementsByClassName('image-menu-container')[0].classList.toggle('change');
    }

    document.getElementsByClassName('nav-menu')[0].style.display = sessionStorage.getItem('showMenu');
});


function displayMenu() {
    document.getElementsByClassName('image-menu-container')[0].classList.toggle('change');
    if (navBarItems.style.display == 'none') {
        navBarItems.style.display = 'block';
        sessionStorage.setItem('showMenu', "block");
    }
    else {
        navBarItems.style.display = 'none';
        sessionStorage.setItem('showMenu', "none");
    }
    
    navBarItems.classList.toggle('w3-animate-zoom');
    navBarItems.classList.toggle('w3-animate-opacity');
}