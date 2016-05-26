function interpretation_aluTG(obj,alu){
	var listPrice = obj["price"];var suffixe = "_"+alu;var list_price_unity = 0;var sale_price_unity = 0;var jeconomise_unity = 0;var particule = "";var texteFlap = false;
	$("#blocPromo_"+alu).addClass("alu_blocPrix_jaune_arrondi");
	$("#prixBarre_"+alu).addClass("alu_prixBarreCache");
	if(obj["pricePerUnit"] != undefined && obj["pricePerUnit"] != "") 
	{
		particule = getParticuleTG(obj["pricePerUnit"]);
		list_price_unity = Math.round(parseFloat(obj["price"]) / parseFloat(obj["PUPUV"])*100)/100;
		sale_price_unity = Math.round(parseFloat(obj["priceOnSale"]) / parseFloat(obj["PUPUV"])*100)/100;
		jeconomise_unity = calculJEconomiseTG(list_price_unity,sale_price_unity);
		if($("#jEconomiseUnit"+suffixe).text() == "")
		{
			if(jeconomise_unity > 0 && obj["displayDiscount"] != undefined && obj["displayDiscount"] != "false")
			{
				$("#jEconomiseUnit"+suffixe).html("<p>J'&eacute;conomise <strong>"+reformatZeroTG(jeconomise_unity) +" €/<span class=\"alu_prixBarreProduit_m2\">"+particule+"</span></strong></p>");
				hideRounded(alu);
				hideWhitePrice(alu);
			}
			else 
				hideObjectTG("#jEconomiseUnit"+suffixe);
		}
		else
			hideRounded(alu);
		$("#pricePerUnit"+suffixe).html(getRegularMasterPriceTG(reformatUnityTG(obj["pricePerUnit"]),particule));
	}	
	if(obj["priceOnSale"] != undefined && obj["priceOnSale"] != "") 
	{
		var valeurJeconomise = 0;var flap = 0;
		if(obj["displayDiscount"] != undefined && obj["displayDiscount"] != "false")
		{
			$("#listPrice").addClass("barre");
			valeurJeconomise = calculJEconomiseTG(obj["price"],obj["priceOnSale"]);
			flap = getFlapTG(obj["price"],obj["priceOnSale"]);
			$("#listPrice"+suffixe).html(reformatZeroTG(listPrice)  + " &euro;");
			$("#listPriceUnit"+suffixe).html(reformatZeroTG(list_price_unity)  + " €/"+particule);
			hideWhitePrice(alu);
		}
		$("#priceOnSale"+suffixe).html(getRegularMasterPriceTG(reformatZeroTG(obj["priceOnSale"]),""));	
		if($("#jEconomise"+suffixe).text() == "")
		{
			if(valeurJeconomise > 0)
			{
				$("#jEconomise"+suffixe).html("<p>J'&eacute;conomise <strong>"+reformatZeroTG(valeurJeconomise) + " &euro;</strong></p>");
				hideRounded(alu);
			}
			else 
				hideObjectTG("#jEconomise"+suffixe);
		}
		else
		{
			texteFlap = true;
			hideRounded(alu);
		}
		if(flap > 1 )
		{
			$("#flap"+suffixe).html("<p>J'&eacute;conomise <strong>" + flap  + " %</strong></p>");
			hideRounded(alu);
		}
		else
			hideObjectTG("#flap"+suffixe);
	}
	else
	{
		hideObjectTG("#flap"+suffixe);
		if($("#jEconomise"+suffixe).text() == "")
			hideObjectTG("#jEconomise"+suffixe);
		else
			hideRounded(alu);
		$("#priceOnSale"+suffixe).html(getRegularMasterPriceTG(reformatZeroTG(obj["price"]),""));
	}	
}

function reformatZeroTG(price){
	price = price+"";
	if(price != undefined && price != null && price !="" )
	{
		var tab = price.split('.');
		if(tab.length >1)
		{
  			var particule = tab[1];
  			if(particule.length < 2 )
				price = tab [0] + "," + particule + "0";
		}
		price = price.replace(".", ",");
		price = price.replace(",00", "");
	}			
	return price; 
}

function reformatUnityTG(price)
{
	price = price+"";
	if(price != undefined && price != null && price !="" )
		price = price.replace(".", ",");		
	return price; 
}

function callAjaxTG(sku, functionToExecute)
{
	$.ajax(
    {
		type: "GET",url: "/store/xmlPrices.jsp?skuId="+sku,	dataType: "xml",complete : function(data, status) 
		{
			var products = data.responseXML;
			var obj = new Object();
			$(products).find('price').each(function()
			{
				obj["priceOnSale"] = $(this).find('salePrice').text();
				obj["priceOnSale"] = obj["priceOnSale"].replace(/,/i, ".");
				obj["price"] = $(this).find('listPrice').text();
				obj["price"] = obj["price"].replace(/,/i, ".");
				obj["pricePerUnit"] = $(this).find('pricePerUnite').text();
				if(obj["pricePerUnit"] != undefined && obj["pricePerUnit"] != "")
					obj["pricePerUnit"] = obj["pricePerUnit"].replace(",", ".");
				obj["displayDiscount"] = $(this).find('displayDiscount').text();
				obj["PUPUV"] = $(this).find('PUPUV').text();
				eval(functionToExecute);
			});
		}
	});
}

function calculJEconomiseTG(price,salePrice){
	var returned = 0;
		if(salePrice != undefined && price != undefined && salePrice != "" && price != "")
			if((parseFloat(price) - parseFloat(salePrice) > 0))
				returned = Math.round((parseFloat(price) - parseFloat(salePrice))*100)/100;
	return returned;
}

function getFlapTG(price, priceOnSale){
	var returned = 0;
	if(priceOnSale != undefined && price != undefined && priceOnSale != "" && price != "")
		if((parseFloat(price) - parseFloat(priceOnSale) > 0))
			returned = Math.round((1-(priceOnSale/price))*100);
	return returned;
}

function getParticuleTG(particule){
	var tab = particule.split('€');
	if(tab.length >=1)
		particule = tab[1];
	particule = particule.replace("/", "");
	return particule;
}

function hideObjectTG(objToHide){
	$(objToHide).css("display","none");
	$(objToHide).css("visibility","hidden");
}

function getRegularMasterPriceTG(price,particule){
	var returned = "";
	var str = price + "";
	var tab = str.split(",");
	returned += "<strong>";
	returned += "<span class=\"alu_prixProduit_entier\">"+tab[0]+"</span>";
	returned += "<span class=\"alu_prixProduit_droite\">";
	returned += "<span class=\"alu_prixProduit_euroSign\">€ ";
	if(particule != undefined && particule != null && particule !="" )
		returned += "<span class=\"alu_prixProduit_m2\">Le "+particule+"</span>";
	returned += "</span>";
	if(tab.length > 1)
	{
		var tabPrix = tab[1].split(' ');
		if (tabPrix.length > 0)
			returned += "<span class=\"alu_prixProduit_centimes\">"+tabPrix[0].replace("00", "")+"</span>";
	}
	returned += "</span>";
	returned += "</strong>";
	return returned;
}

function hideRounded(alu){
$("#blocPromo_"+alu).removeClass("alu_blocPrix_jaune_arrondi");
$("#prixBarre_"+alu).removeClass("alu_prixBarreCache");
}

function hideWhitePrice(alu){
$("#blocPrix_"+alu).removeClass("prixBlanc");
}