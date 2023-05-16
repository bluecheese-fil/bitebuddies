function loadFood() {
    let jsoncookie = {"menu" : "true"};
    $.ajax({
        url: "/php/menu.php",
        type: "POST",
        dataType: "JSON",
        data: (jsoncookie),
        success:function(response) {
            var html;            
            var array=[];
            conta=1;
            indice=0;
            for(var i=1; i<response.length; i++) {
                if(response[i]["categoria"]==response[i-1]["categoria"] && i==response.length-1) {
                    conta++; /*Attenzione, potrebbe dare problemi sull'ultima categoria nell'ultima iterazione*/
                    array[indice]=conta;
                    break;
                }
                else if(response[i]["categoria"]==response[i-1]["categoria"]) conta++;
                else {
                    array[indice]=conta;
                    conta=1;
                    indice++;
                }
            }
            var index=0;
            for(var j=0; j<array.length; j++) {
                var categoria=response[index]["categoria"].split(" ");
                var rest_name=response[index]["rest_name"].split(" ");
                var elencoContainer = $("<div>").addClass("elenco").attr("id", categoria[0]+rest_name[0]);
                li=`<li class="menù" id="${categoria[0]}">${categoria[0]}</li>`;
                $(".sidebar ul").append(li);
                var ii=0;
                for(var i=index; i<index+array[j]; i++) {
                    var oggetto=(response[i]["oggetto"]).split(" ");
                    html = `
                    <div class="id${ii}_elem">
                        <h2 class="cibo">${response[i]["oggetto"]}</h2>
                        <h5 class="ingredienti">${response[i]["ingrediente1"]} · ${response[i]["ingrediente2"]} · ${response[i]["ingrediente3"]}</h5>
                        <div class="costo"><h2 class="prezzo_box" id="corto" name="prezzo_${response[i]["oggetto"]}">${response[i]["prezzo"]}€</h2></div>
                        <button class="carrello" id="box_${response[i]["oggetto"]}" name="${response[i]["oggetto"]}">
                            <h4 class="aggiungi">Aggiungi al carrello</h4>
                            <img src="/images/static/carrello.png" width="30px" height="30px" class="cart">
                        </button>

                        <div class="contatore" id="${response[i]["oggetto"]}">
                            <button class="minus" id="${response[i]["oggetto"]}" name="minus_${response[i]["oggetto"]}">
                                <img src="/images/static/minus.png" width="20px" height="20px" class="meno">   
                            </button>
                            <input type="text" value="1" size="2px" class="porzioni" name="contatore_${response[i]["oggetto"]}" readonly disabled>            
                            <button class="plus" id="${response[i]["oggetto"]}" name="plus_${response[i]["oggetto"]}">
                                <img src="/images/static/più.png" width="20px" height="20px" class="più">
                            </button>
                            <button class="spesa">
                                <img src="/images/static/carrello.png" width="30px" height="30px" class="popup">
                            </button>
                        </div>

                    </div>`;

                    ii++;
                    elencoContainer.append(html);
                }
                $(".cont").append(elencoContainer);
                var index=index+array[j];
            }
            var nome, costo;
            $(".elenco").hide();
            $(".elenco:first").show();
            $(".contatore").hide();
            $(".carrello").click(function() {
                nome=$(this).attr("name");
                costo=$(".prezzo_box[name='prezzo_" + nome + "']").text();
                $(this).parent().find(".contatore").fadeIn();
                $(this).fadeOut();

                var conta=1;
                $(".minus").prop("disabled", true);
                $(".minus").click(function() {     
                    console.log(conta);
                    var x=$(this).attr("id");
                    if(conta==1) {
                        $(".porzioni[name='contatore_" + x + "']").val(conta);
                    }
                    else {
                        conta--;
                        $(".porzioni[name='contatore_" + x + "']").val(conta);
                        var prezzo=parseInt(costo);
                        var prezzo=prezzo*conta;
                        $(".prezzo_box[name='prezzo_" + x + "']").text(prezzo+"€");
                        if(conta==1) {
                            $(".minus").prop("disabled", true);
                        }
                    }
                });
                $(".plus").click(function() {
                    console.log(conta);
                    var x=$(this).attr("id");
                    conta++;
                    $(".minus").prop("disabled", false);
                    $(".porzioni[name='contatore_" + x + "']").val(conta);
                    var prezzo=parseInt(costo);
                    var prezzo=prezzo*conta;
                    $(".prezzo_box[name='prezzo_" + x + "']").text(prezzo+"€");
                });
            });
        }
    });
}

function loadQuantita() {
    let jsoncookie = {"loadQuantita" : "true"};
    $.ajax({
        url: "/php/menu.php",
        type: "POST",
        dataType: "JSON",
        data: (jsoncookie),
        success:function(response) {
            nome="mrpasta";
            $(".carrello").click(function() {
                var id=$(this).attr("name").split(" ");
                $("#box_"+id[0]).hide();
                $("#"+id[0]+"_mrpasta").fadeIn();
            });
        }
    });
}

function loadRistorante() {
    let jsoncookie = {"ristoranti" : "true"};
    $.ajax({
        url: "/php/menu.php",
        type: "POST",
        dataType: "JSON",
        data: (jsoncookie),
        success:function(response) {
            var nome=response[0]["nome"];
            $(".title").append(nome);
            var img=`<img src="/images/static/${response[0]["immagine"]}.jpg" class="foto" width="352.6px" height="264.6px"></img>`;
            $(".content").append(img);
            var info=`
            <h4 class="categoria">${response[0]["categoria"]}</h4>
            <h4 class="descrizione">${response[0]["descrizione"]}</h4>
            <h4 class="indirizzo"><img src="/images/static/posizione.png" width="20px" height="20px" class="posizione">${response[0]["indirizzo"]}</h4>
            <h4 class="consegna"><img src="/images/static/consegna.png" width="20px" height="20px" class="img-consegna">Consegna: ${response[0]["costo_consegna"]}€</h4>
            <img src="/images/static/star.png" class="voto"><h4 class="stella">${response[0]["voto"]}</h4>
            <div class="grid-container" id="medio">
                <div class="grid-item">
                  <div id="giallo"></div>
                </div>
                <div class="grid-item" id="euro">${response[0]["prezzo"]}</div>
            </div>`;
            $(".info").append(info);
        }
    });
}

function change() {
    let jsoncookie = {"change" : "true"};
    $.ajax({
        url: "/php/menu.php",
        type: "POST",
        dataType: "JSON",
        data: (jsoncookie),
        success:function(response) {
            var id0=response[0]["categoria"].split(" ");
            var name=response[0]["rest_name"].split(" ");
            $("#"+id0[0]).css('background-color', 'rgba(197, 192, 192, 0.726)');
            $(".menù").click(function() {
                var id=$(this).attr("id").split(" ");
                $("#"+id0[0]).css('background-color', 'unset');
                $("#"+id[0]).css('background-color', 'rgba(197, 192, 192, 0.726)');
                $("#"+id0[0]+name[0]).hide();
                $("#"+id[0]+name[0]).fadeIn();
                id0=id;                
            });
        }
    });
}