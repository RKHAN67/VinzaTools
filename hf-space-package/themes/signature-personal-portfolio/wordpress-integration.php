<?php
/**
 * WordPress Integration for Premium Portfolio
 * 
 * 1. Copy this code to your theme's functions.php file.
 * 2. Use the shortcode [premium_portfolio] on any page.
 */

function premium_enqueue_portfolio_assets() {
    // Replace with your actual hosted asset URLs after building
    wp_enqueue_style('premium-portfolio-style', 'https://your-domain.com/dist/assets/index.css', array(), '1.0');
    wp_enqueue_script('premium-portfolio-script', 'https://your-domain.com/dist/assets/index.js', array(), '1.0', true);
}

function premium_portfolio_shortcode() {
    ob_start();
    ?>
    <div id="root"></div>
    <?php
    add_action('wp_footer', 'premium_enqueue_portfolio_assets');
    return ob_get_clean();
}
add_shortcode('premium_portfolio', 'premium_portfolio_shortcode');
