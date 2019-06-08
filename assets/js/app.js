var enableSubmit = function(token) {
	$('.contact.button.submit').removeAttr('disabled');
};

var disableSubmit = function(token) {
	$('.contact.button.submit').attr('disabled', '');
};

$(document).ready(function () {
	var $contactButton = $('.contact.button.open');
	var $submitButton = $('.contact.button.submit');
	var $cancelButton = $('.contact.button.cancel');
	var $form = $('#contactForm');

	var hideFormTimeout = -1;

	var showContactForm = function() {
		if (hideFormTimeout > 0) {
			clearTimeout(hideFormTimeout);
			hideFormTimeout = -1;
		}
		$contactButton.removeClass("fadeInDown");
		$contactButton.addClass("fadeOutUp");
		$form.removeClass("fadeOutDown");
		$form.addClass("fadeInUp");
		$form.css("display", "block");
	};

	var hideContactForm = function() {
		$contactButton.removeClass("fadeOutUp");
		$contactButton.addClass("fadeInDown");
		$form.removeClass("fadeInUp");
		$form.addClass("fadeOutDown");
		hideFormTimeout = setTimeout(function() {
			$form.css("display", "none");
		}, 1500); //$animation-duration
	};

	var hideNotificationTimeout = -1;


	var $notification = $('.form.notification');
	var $notificationText = $notification.find('span.notification-text');

	var showNotification = function(type, icon, msg) {
		var $notificationIcon = $notification.find('svg');
		if (hideNotificationTimeout > 0) {
			clearTimeout(hideNotificationTimeout);
			hideNotificationTimeout = -1;
		}
		$notification.attr("class", "form notification is-small m-t-sm " + type);
		$notificationText.text(msg);

		// $notification.removeClass("fadeOutUp");
		$notification.addClass("fadeInDown");
		$notification.css("display", "block");

		$notificationIcon.attr("data-icon", icon);

		// console.log($notificationIcon);
		// console.log(icon);
		// console.log($notificationIcon.attr("data-icon"));
		// console.log($notificationIcon.attr("data-icon"));
	};

	var hideNotification = function() {
		$notification.removeClass("fadeInDown");
		$notification.addClass("fadeOutUp");
		hideNotificationTimeout = setTimeout(function() {
			$notification.css("display", "none");
		});
	};

	$contactButton.on('click', function(e) {
		showContactForm();
	});

	$cancelButton.on('click', function(e) {
		hideContactForm();
		hideNotification();
	});

	var $name = $("#inputName");
	var $email = $("#inputEmail");
	var $subject = $("#inputSubject");
	var $message = $("#inputMessage");

	var awsEndpoint = "https://6axwuo7klf.execute-api.us-west-1.amazonaws.com/default/forward_message3"

	$submitButton.on('click', function(e) {
		console.log('click');
		if (!$form.get()[0].checkValidity()) {
			return;
		}

		hideNotification();
		e.preventDefault();

		var formRequest = new Request(awsEndpoint, {
	    	method: 'POST',
	    	dataType: 'jsonp',
	    	crossDomain: true,
	        body: JSON.stringify({
	        	name: $name.val(),
	            email: $email.val(),
	            subject: $subject.val(),
	            message: $message.val(),
	            'g-recaptcha-response': grecaptcha.getResponse()
	        })
	    });

		fetch(formRequest)
	        .then(function(response) {
	          if (response.status === 200) {
	            hideContactForm();
	            showNotification("is-success", "check", "Message sent. Thank you!");
	          } else {
	            showNotification("is-danger", "exclamation-circle", "Something went wrong. Please try again");
	          }
	        });
	});
	
});