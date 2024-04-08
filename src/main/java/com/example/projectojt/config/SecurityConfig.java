package com.example.projectojt.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@Order(2)
public class SecurityConfig {

    @Autowired
    private OurUserDetailsService userDetailsService;
    @Bean
    public InMemoryUserDetailsManager inMemoryUserDetailsManager() {
        UserDetails user = User.withUsername("user")
                .password("password")
                .roles("USER")
                .build();

        UserDetails admin = User.withUsername("admin")
                .password("adminpassword")
                .roles("ADMIN")
                .build();

        return new InMemoryUserDetailsManager(user, admin);
    }
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity.authorizeHttpRequests(auth -> auth
                        .requestMatchers("/EcommerceStore/product", "/EcommerceStore/products/more/**","/EcommerceStore/loginpage",
                                "/EcommerceStore/productDetails/{product_id}", "/css/**", "/js/**", "/vendor/**",
                                "/fonts/**", "/images/**", "/static/**", "/asset/**",
                                "/EcommerceStore/register_form", "/EcommerceStore/register",
                                "/EcommerceStore/otp_verify","/EcommerceStore/search","/EcommerceStore/productFilter/**"
                                ,"/EcommerceStore/productBrandFilter/**","/EcommerceStore/productDetails/**",
                                "/EcommerceStore/products/more","/asset/**","/styles.css","/admin/**").permitAll()
                        .anyRequest().authenticated())
                .httpBasic(withDefaults())
                .formLogin(formLogin ->
                        formLogin
                                .loginPage("/EcommerceStore/loginpage")
                                .permitAll()
                                .loginProcessingUrl("/EcommerceStore/login")
                                .defaultSuccessUrl("/EcommerceStore/product", true)
                                .failureUrl("/EcommerceStore/loginpage?error=true")
                                .failureHandler((request, response, exception) -> {
                                    String errorMessage = "Invalid username or password";
                                    request.getSession().setAttribute("errorMessage", errorMessage);
                                    response.sendRedirect("/EcommerceStore/loginpage?error=true");
                                })).logout(
                        logout -> logout
                                .logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
                                .permitAll()
                )
                .oauth2Login(oauth2 -> oauth2
                        .loginPage("/login/oauth2/authorization/google")
                        .defaultSuccessUrl("/EcommerceStore/signingoogle", true)
                        .failureUrl("/EcommerceStore/loginpage?error=true")).logout(
                        logout -> logout
                                .logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
                                .permitAll()
                )
                .oauth2Login(oauth2 -> oauth2
                        .loginPage("/login/oauth2/authorization/facebook")
                        .defaultSuccessUrl("/EcommerceStore/product", true)
                        .failureUrl("/EcommerceStore/loginpage?error=true")).logout(
                        logout -> logout
                                .logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
                                .permitAll()
                )
                .csrf(AbstractHttpConfigurer::disable);

        return httpSecurity.build();


    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider auth = new DaoAuthenticationProvider();
        auth.setUserDetailsService(userDetailsService);
        auth.setPasswordEncoder(passwordEncoder());
        return auth;
    }

    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public static PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


}