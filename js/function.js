document.addEventListener("DOMContentLoaded", function() {
    var trackableElement;
    var menu = document.querySelector(".menu");
    var appMenu = document.querySelector(".app-menu-container");
    var overlay = document.querySelector(".menu-background");
    var burger = document.querySelector(".app-menu-burger");

    var touchingElement = false;
    var startTime;
    var startX = 0,
        startY = 0;
    var currentX = 0,
        currentY = 0;

    var isOpen = false;
    var isMoving = false;
    var menuWidth = 0;
    var lastX = 0;
    var lastY = 0;
    var moveX = 0; // where in the screen is the menu currently
    var dragDirection = "";
    var maxOpacity = 0.5; // in case if you want to change this, don"t forget to change the value of the opacity in the css class .menu--visible .menu-background

    var init = function(element, start, move, end) {
        trackableElement = element;

        startTime = new Date().getTime(); // start time of the touch

        addEventListeners();
    }

    var addEventListeners = function() {
        trackableElement.addEventListener("touchstart", onTouchStart, false);
        trackableElement.addEventListener("touchmove", onTouchMove, false);
        trackableElement.addEventListener("touchend", onTouchEnd, false);


        overlay.addEventListener("click", closeMenuOverlay, false); // I want to be able to click the overlay and immediately close the menu (in the space between the actual menu and the page behind it)
        burger.addEventListener("click", clickOpenMenu, false); // I want to be able to click the burger and immediately open the menu
    }

    function onTouchStart(evt) {
        startTime = new Date().getTime();
        startX = evt.touches[0].pageX;
        startY = evt.touches[0].pageY;

        touchingElement = true;

        touchStart(startX, startY)

    }

    function onTouchMove(evt) {
        if (!touchingElement)
            return;

        currentX = evt.touches[0].pageX;
        currentY = evt.touches[0].pageY;
        const translateX = currentX - startX; // distance moved in the x axis
        const translateY = currentY - startY; // distance moved in the y axis

        touchMove(evt, currentX, currentY, translateX, translateY)
    }

    function onTouchEnd(evt) {

        if (!touchingElement)
            return;

        touchingElement = false;
        const translateX = currentX - startX; // distance moved in the x axis
        const translateY = currentY - startY; // distance moved in the y axis

        const timeTaken = (new Date().getTime() - startTime);

        touchEnd(currentX, currentY, translateX, translateY, timeTaken)
    }


    function touchStart(startX, startY) {
        var menuOpen = document.querySelector(".menu.menu--visible");

        if (menuOpen !== null) {
            isOpen = true;
        } else {
            isOpen = false;
        }

        menu.classList.add("no-transition");
        appMenu.classList.add("no-transition");

        isMoving = true;
        menuWidth = document.querySelector(".app-menu").offsetWidth;
        lastX = startX;
        lastY = startY;

        if (isOpen) {
            moveX = 0;
        } else {
            moveX = -menuWidth;
        }

        dragDirection = "";
        menu.classList.add("menu--background-visible");
    }

    function touchMove(evt, currentX, currentY, translateX, translateY) {
        if (!dragDirection) {
            if (Math.abs(translateX) >= Math.abs(translateY)) {
                dragDirection = "horizontal";
            } else {
                dragDirection = "vertical";
            }

            requestAnimationFrame(updateUi); // this is what effectively does the animation (ﾉ◕ヮ◕)ﾉ*:・ﾟ✧
        }
        if (dragDirection === "vertical") {
            lastX = currentX;
            lastY = currentY;
        } else {
            evt.preventDefault();

            if (moveX + (currentX - lastX) < 0 && moveX + (currentX - lastX) > -menuWidth) {
                moveX = moveX + (currentX - lastX);
            }

            lastX = currentX;
            lastY = currentY;

            overlay.classList.add("no-transition");

            var percentageBeforeDif = (Math.abs(moveX) * 100) / menuWidth;
            var percentage = 100 - percentageBeforeDif;

            var newOpacity = (((maxOpacity) * percentage) / 100);

            if (overlay.style.opacity !== newOpacity.toFixed(2) && newOpacity.toFixed(1) % 1 !== 0) {
                overlay.style.opacity = newOpacity.toFixed(2);
            }

        }
    }

    function touchEnd(currentX, currentY, translateX, translateY, timeTaken) {
        isMoving = false;
        var velocity = 0.3;

        if (currentX === 0 && currentY === 0) {
            if (isOpen) {
                appMenu.classList.remove("no-transition");
                menu.classList.remove("no-transition");
            } else {
                menu.classList.remove("menu--background-visible");
                menu.classList.remove("no-transition");

            }
        } else {
            if (isOpen) {
                if ((translateX < (-menuWidth) / 2) || (Math.abs(translateX) / timeTaken > velocity)) {
                    closeMenu(translateX);
                    isOpen = false;
                } else {
                    openMenu();
                    isOpen = true;
                }
            } else {
                if (translateX > menuWidth / 2 || (Math.abs(translateX) / timeTaken > velocity)) {
                    openMenu();
                    isOpen = true;
                } else {
                    closeMenu(translateX);
                    isOpen = false;
                }

            }
        }

        menu.classList.remove("no-transition");
        appMenu.classList.remove("no-transition");

        overlay.classList.remove("no-transition");

        menu.classList.add("menu--animatable");
    }

    function updateUi() {
        if (isMoving) {
            var element = document.querySelector(".app-menu-container");

            element.style.transform = "translateX(" + moveX + "px)";
            element.style.webkitTransform = "translateX(" + moveX + "px)";

            requestAnimationFrame(updateUi);
        }
    }

    function closeMenu(translateX) {

        function OnTransitionEnd() {
            overlay.style.opacity = "";
            overlay.style.display = "";

            menu.classList.remove("menu--background-visible");
            menu.classList.remove("menu--animatable");
            menu.removeEventListener("transitionend", OnTransitionEnd, false);
        }

        if (translateX < 0 || !isOpen) {
            appMenu.style.transform = "";
            appMenu.style.webkitTransform = "";

            menu.classList.remove("menu--background-visible");
            menu.classList.remove("menu--visible");

            menu.addEventListener("transitionend", OnTransitionEnd, false);
        }
    }

    function openMenu() {

        appMenu.style.transform = "";
        appMenu.style.webkitTransform = "";

        menu.classList.add("menu--visible");
        menu.classList.add("menu--background-visible");

        overlay.style.opacity = "";
    }

    function closeMenuOverlay() {
        function OnTransitionEnd() {
            menu.classList.remove("menu--background-visible");
            menu.classList.remove("menu--animatable");
            overlay.style.display = "";

            menu.removeEventListener("transitionend", OnTransitionEnd);
        }

        menu.addEventListener("transitionend", OnTransitionEnd, false);

        menu.classList.remove("menu--visible");
    }

    function clickOpenMenu() {

        menu.classList.add("menu--background-visible");

        requestAnimationFrame(function() {
            setTimeout(function() {
                menu.classList.add("menu--visible");
                menu.classList.add("menu--animatable");
            }, 1)
        });
    }

    init(document.querySelector(".app-menu-container"));

});
