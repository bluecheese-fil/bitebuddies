function loadContenuto(file) {
    let jsoncookie={"loadContenuto" : "true"};
    $.ajax({
        url: "/php/cucina.php",
        type: "POST",
        dataType: "JSON",
        data: (jsoncookie),
        success:function(response) {
            console.log(response);
            var categ=`<h4 class="titolo-categoria">${file}</h4>`;
            $(".item-categoria").append(categ);
            var conta=0, primo=0, ultimo=0;
            for(var i=0; i<response.length; i++) {
                console.log(response[i]["categoria"]);
                if(response[i]["categoria"]==file && conta==0) {
                    conta++;
                    primo=i;
                }
                else if(i!=0 && response[i-1]["categoria"]==response[i]["categoria"] && i==response.length-1) {
                    ultimo=i+1;
                    break;
                }
                else if(i!=0 && response[i]["categoria"]!=file && response[i-1]["categoria"]==file) {
                    ultimo=i;
                    break;
                }
            }
            if(primo==response.length-1) {
                ultimo=primo+1;
            }
            for(var i=primo; i<ultimo; i++) {
                switch (response[i]["prezzo"]) {
                    case "€":
                        var tipo="economico";
                        var colore="verde";
                        break;
                    case "€€":
                        var tipo="medio";
                        var colore="giallo";
                        break;
                    case "€€€":
                        var tipo="costoso";
                        var colore="rosso";
                        break;               
                }
                var ristorante= `
                <div class="descrizione" id="${response[i]["nome"]}">
                    <img src="/images/ristoranti/${response[i]["immagine"]}.jpg" width="252.6px" height="154.6px" id="cucina_it">
                    <h2 class="testo" id="primo">${response[i]["nome"]}</h2>
                    <img src="/images/static/piatti.png" class="mangiare"><h6 class="caratteristiche">${response[i]["descrizione"]}</h6>
                    <img src="/images/static/posizione.png" class="posizione"><h6 class="indirizzo">${response[i]["indirizzo"]}</h6>
                    <img src="/images/static/consegna.png" class="consegna"><h6 class="costo">Consegna: ${response[i]["costo_consegna"]}€</h6>
                    <img src="/images/static/star.png" class="voto"><h6 class="stella">${response[i]["voto"]}</h6>
                    <div class="grid-container" id=${tipo}>
                    <div class="grid-item">
                        <div id=${colore}></div>
                    </div>
                    <div class="grid-item" id="euro">${response[i]["prezzo"]}</div>
                    </div>
                </div>`;

                $(".scatola").append(ristorante);
            }
            $(".descrizione").click(function() {
                var id=$(this).attr("id");
                console.log(id);
                window.location.href="/ristoranti/"+id+".html";
            });
            
        }
    });
}

function cambiaCategoria(file) {
    let jsoncookie={"cambiaCategoria" : "true"};
    $.ajax({
        url: "/php/cucina.php",
        type: "POST",
        dataType: "JSON",
        data: (jsoncookie),
        success:function(response) {
            console.log(response);
            var categoria;
            var immagine=`<img src="/images/static/next.png" width="30px" height="30px" class="next" id="destra"></img>`;
            for(var i=0; i<response.length; i++) {
                if(response[i]["categoria"]==file) continue;
                else {
                    categoria=`<div class="sezioni-item">${response[i]["categoria"]}</div>`;
                    $(".sezioni").append(categoria);
                }
            }
            $(".frecciadx").append(immagine);
            $(".sezioni").hide();
            $(".frecciadx").hide();

            $(".sezioni-item").click(function() {
                var id=$(this).text();
                console.log(id);
                window.location.href=id+".html";
            });
        }
    });
}