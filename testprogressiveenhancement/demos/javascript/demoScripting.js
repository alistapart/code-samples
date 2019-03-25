testUserDevice.init(function(){
	/* 
		test passed. time to make the donuts!
		- Note: the scripting in this page makes use of 
			- jQuery: http://jquery.com
			- jQuery UI: http://ui.jquery.com
			- Filament Group's jQuery select-to-slider plugin: http://www.filamentgroup.com/lab/progressive_enhancement_convert_select_box_to_accessible_jquery_ui_slider/
	*/
	//from here on is wrapped in a jQuery document ready event
	$(document).ready(function(){ 
	
	
	//set a scripted max-width on fieldsets, since the css way is not widely supported

	

	/*convert selects to sliders*/
	$('select').each(function(){
		$(this).accessibleUISlider({width: 230}).hide();
	});		
	
	/*datepicker*/
	$('input[name=birthday]').datepicker();		
	
	
	/*favorite pet toggles*/
	$('input[type=radio]').not(':selected').next().next().hide().find('input').attr('disabled', 'disabled');
	$('input[type=radio]').click(function(){
		if($(this).not(':selected')){
			$('input[type=radio]').not(this).next().next(':visible').fadeTo(0.001, 200, function(){$(this).slideUp(200).find('input:eq(0)').attr("disabled","disabled");});
			$(this).next().next(':hidden').css('opacity', 0.001).slideDown(200, function(){ $(this).fadeTo(0.9999, 200).find('input:eq(0)').removeAttr("disabled"); });
		}	
	});

	/*dog breed autocomplete*/
	$("input[name=dog_breed]").autocomplete(
		{data: ["Affenpinscher", "Afghan Hound", "African Boerboel", "Airedale Terrier", 
		"Akbash Dog", "Akita", "Alapha Blue Blood Bulldog", "Alaskan Klee Kai", 
		"Alaskan Malamute", "American Bulldog", "American Eskimo", "American Foxhound", 
		"American Pit Bull Terrier", "American Staffordshire Terrier", "American Water Spaniel", 
		"Anatolian Shepherd", "Australian Cattle Dog", "Australian Kelpie", "Australian Shepherd", 
		"Australian Terrier", "Basenji", "Basset Hound", "Beagle", "Bearded Collie", "Beauceron", 
		"Bedlington Terrier", "Belgian Malinois", "Belgian Sheepdog", "Belgian Tervuren", 
		"Bernese Mountain Dog", "Bichon Frise", "Black and Tan Coonhound", "Black Russian Terrier", 
		"Bloodhound", "Border Collie", "Border Terrier", "Borzoi", "Boston Terrier", "Bouvier des Flandres", 
		"Boxer", "Briard", "Briquet Griffon Vendeen", "Brittany", "Brussels Griffon", "Bull Terrier", 
		"Bullmastiff", "Cairn Terrier", "Canaan Dog", "Cardigan Welsh Corgi", "Catahoula Leopard Dog", 
		"Cavalier King Charles Spaniel", "Central Asian Ovtcharka", "Cesky Terrier", "Chesapeake Bay Retriever", 
		"Chihuahua", "Chinese Crested", "Chinese Foo", "Chinese Shar-Pei", "Chow Chow", "Clumber Spaniel", 
		"Cocker Spaniel", "Collie", "Coton De Tulear", "Curly-Coated Retriever", "Dachshund", "Dalmatian", 
		"Dandie Dinmont Terrier", "Doberman Pinscher", "Dogue de Bordeaux", "English Bulldog", 
		"English Cocker Spaniel", "English Foxhound", "English Setter", "English Springer Spaniel", 
		"English Toy Spaniel", "Estrela Mountain Dog", "Field Spaniel", "Fila Brasileiro", "Finnish Spitz", 
		"Flat-Coated Retriever", "Fox Terrier (Smooth)", "Fox Terrier (Wire)", "French Bulldog", "German Pinscher", 
		"German Shepherd Dog", "German Shorthaired Pointer", "German Wirehaired Pointer", "Giant Schnauzer", 
		"Golden Retriever", "Gordon Setter", "Great Dane", "Great Pyrenee", "Greater Swiss Mountain Dog", 
		"Greyhound", "Harrier", "Havanese", "Ibizan Hound", "Irish Setter", "Irish Terrier", "Irish Water Spaniel", 
		"Irish Wolfhound", "Italian Greyhound", "Jack Russell Terrier", "Japanese Chin", "Keeshond", 
		"Kerry Blue Terrier", "Komondor", "Kooikerhondje", "Kuvasz", "Labrador Retriever", "Laekenois", 
		"Lakeland Terrier", "Lhasa Apso", "Lowchen", "Maltese", "Manchester Terrier", "Maremma Sheepdog", 
		"Mastiff", "Miniature Australian Shepherd", "Miniature Bull Terrier", "Miniature Pinscher", 
		"Miniature Poodle", "Miniature Schnauzer", "Neapolitan Mastiff", "Newfoundland", "Norfolk Terrier", 
		"Norwegian Buhund", "Norwegian Elkhound", "Norwich Terrier", "Nova Scotia Duck Tolling Retriever", 
		"Old English Sheepdog", "Otterhound", "Papillon", "Pekingese", "Pembroke Welsh Corgi", 
		"Petit Basset Griffon Vendeen", "Pharaoh Hound", "Pointer", "Polish Owczarek Nizinny", "Pomeranian", 
		"Portuguese Water Dog", "Pug", "Puli", "Rat Terrier", "Red and White Setter", "Redbone Coonhound", 
		"Rhodesian Ridgeback", "Rottweiler", "Saint Bernard", "Saluki", "Samoyed", "Schipperke", "Scottish Deerhound", 
		"Scottish Terrier", "Sealyham Terrier", "Shetland Sheepdog", "Shiba-Inu", "Shih Tzu", "Siberian Husky", 
		"Silky Terrier", "Skye Terrier", "Soft Coated Wheaten Terrier", "Spinone Italiano", "Staffordshire Bull Terrier", 
		"Standard Poodle", "Standard Schnauzer", "Sussex Spaniel", "Tibetan Spaniel", "Tibetan Terrier", 
		"Toy Fox Terrier", "Toy Manchester Terrier", "Toy Poodle", "Vizsla", "Weimaraner", "Welsh Springer Spaniel", 
		"Welsh Terrier", "West Highland White Terrier", "Whippet", "Wire Fox Terrier", "Wirehaired Pointing Griffon", 
		"Xoloitzcuintli", "Yorkshire Terrier"]
	}).val('Start typing...').focus(function(){if($(this).val() == 'Start typing...'){$(this).val('');}});
	
	/*cat breed autocomplete*/
	$("input[name=cat_breed]").autocomplete(
		{data: ["Abyssinian", "American Bobtail", "American Curl", "American Shorthair", "Balinese", "Bengal", 
		"Birman", "Bombay", "British Shorthair", "Burmese", "Chartreux", "Cornish Rex", "Devon Rex", "Egyptian Mau", 
		"European Burmese", "Exotic Shorthair", "Havana Brown", "Himalayan", "Japanese Bobtail", "Javanese", 
		"Korat", "Maine Coon", "Manx", "Munchkin", "Nebelung", "Norwegian Forest Cat", "Ocicat", "Oriental", 
		"Persian", "Pixie-Bob", "Ragamuffin","Ragdoll", "Russian Blue", "Savannah", "Scottish Fold", "Siamese", 
		"Siberian", "Singapura", "Snowshoe", "Sokoke", "Somali", "Sphynx", "Tonkinese", "Turkish Angora", "Turkish Van"]
	}).val('Start typing...').focus(function(){if($(this).val() == 'Start typing...'){$(this).val('');}});

	/*submit form with ajax*/
	$('form').submit(function(){
		$('button').addClass('sending').text('Sending...');
		$.post('#', 'form vars here', function(){ //just faking the ajax portion with a timeout
			setTimeout(function(){
				window.scrollTo(0,0);
				$('form').replaceWith('<di'+'v id="formResponse"><h1>Update Complete!</h1><p>Thanks for keeping your profile up-to-date.</p></div>');
			}, 2000);
		});
		return false;
	});
});
}); /*end of test */