  function prestamo(val) {
    var pesos = val * 1000;

    // ejemplo
    var interes = 5;
    var total = pesos * interes / 100;

    // Elementos
    var numberMobile = document.getElementById('numberMobile');
    //var numberMobile = document.getElementsByClassName("number-mobile")[0];

    numberMobile.innerHTML='$'+pesos;
  }
