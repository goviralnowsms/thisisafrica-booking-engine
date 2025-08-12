(function($) {
    $(document).ready(function() {
        $('.dates_prices_major button').click(function(ev) {
            ev.preventDefault();
            const $this = $(this);
            const targetSection = $this.parent().closest('.dates_prices_major').next('.dates_prices_minor').find('.dates_prices_hidden');
            
            // Check if the clicked section is already open
            if (targetSection.hasClass('dates_prices_opened')) {
                // If it's open, close it
                targetSection.removeClass('dates_prices_opened');
                // Optional: Change the button text from "+" to "-"
                $this.text('+');
            } else {
                // Close any open sections first
                $('.dates_prices_opened').removeClass('dates_prices_opened');
                // Reset all other buttons to "+"
                $('.dates_prices_major button').text('+');
                // Open the clicked section
                targetSection.addClass('dates_prices_opened');
                // Change the button text to "-"
                $this.text('-');
            }
            
            return true;
        });
    });
})(jQuery);