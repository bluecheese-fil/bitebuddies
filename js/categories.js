function loadContenuto(file) {
    let jsoncookie = {"loadContenuto" : "true", 'kind' : file};

    console.log(jsoncookie);

    $.ajax({
        url: "/php/cucina.php",
        type: "POST",
        dataType: 'JSON',
        data: (jsoncookie),
        success:function(response) {
            console.log("Server success");

            restaurantsHTML = '';

            for (i = 0; i < response["restaurants"].length; i++) {
                restaurant = response["restaurants"][i];

                switch(restaurant["prezzo"]) {
                    case "€": { color = "green"; break; }
                    case "€€": { color = "yellow"; break; }
                    case "€€€": { color = "red"; break; }
                }

                restaurantsHTML += `
                    <div class="restaurant" name="${restaurant["rest_id"]}" onclick = "window.location.assign('/ristoranti.html?id=${restaurant["rest_id"]}');">
                        <div style="width: 50%">
                            <img style="width: 100%" src="/images/ristoranti/${restaurant["immagine"]}.jpg">
                            <a class="restname"> ${restaurant["nome"]} </a>
                        </div>

                        <div style="width: 50%; margin-left: 2.5%; margin-right: 2.5%">
                            <h6> <img src="/images/static/piatti.png" class="littleimg"> ${restaurant["descrizione"]} </h6>
                            <h6> <img src="/images/static/posizione.png" class="littleimg"> ${restaurant["indirizzo"]} </h6>
                            <h6> <img src="/images/static/consegna.png" class="littleimg"> Consegna: ${restaurant["costo_consegna"]}€</h6>
                            <div class="centeredinfo"> <img src="/images/static/star.png" class="littleimg"> <a style="margin-left: 2.5%;" > ${restaurant["voto"]} </a> </div>
                            <div class="centeredinfo"> <a class='coloredcircle' style='background-color: ${color}'> </a> <a style="margin-left: 2.5%;" > ${restaurant["prezzo"]} </a> </div>
                        </div>
                    </div>`;
            }

            $(".restholder").html(restaurantsHTML);
            console.log("Local success");
            
        }, error:function(response){ window.location.href = "/500.html"; }
    });
}