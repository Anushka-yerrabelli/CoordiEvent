package com.coordievent.config;

import com.coordievent.model.*;
import com.coordievent.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.math.BigDecimal;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository, CategoryRepository categoryRepository,
                                   ServiceTypeRepository serviceTypeRepository, ServiceRepository serviceRepository,
                                   BookingRepository bookingRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.count() == 0) {
                // Admin
                User admin = new User();
                admin.setUsername("admin");
                admin.setEmail("admin@coordievent.com");
                admin.setPasswordHash(passwordEncoder.encode("admin123"));
                admin.setRole(Role.ADMIN);
                admin.setName("System Admin");
                userRepository.save(admin);

                // Sample Providers
                User providerVenue = new User();
                providerVenue.setUsername("venueprovider");
                providerVenue.setEmail("venues@coordievent.com");
                providerVenue.setPasswordHash(passwordEncoder.encode("provider123"));
                providerVenue.setRole(Role.PROVIDER);
                providerVenue.setName("Royal Venues");
                providerVenue.setPhoneNumber("+91-9876543210");
                providerVenue.setProviderStatus(ProviderStatus.APPROVED);
                providerVenue.setPortfolioUrl("https://royalvenues.example.com");
                userRepository.save(providerVenue);

                User providerFood = new User();
                providerFood.setUsername("foodprovider");
                providerFood.setEmail("catering@coordievent.com");
                providerFood.setPasswordHash(passwordEncoder.encode("provider123"));
                providerFood.setRole(Role.PROVIDER);
                providerFood.setName("Delight Catering");
                providerFood.setPhoneNumber("+91-8765432109");
                providerFood.setProviderStatus(ProviderStatus.APPROVED);
                providerFood.setPortfolioUrl("https://delightcatering.example.com");
                userRepository.save(providerFood);

                User providerDecor = new User();
                providerDecor.setUsername("decorprovider");
                providerDecor.setEmail("decor@coordievent.com");
                providerDecor.setPasswordHash(passwordEncoder.encode("provider123"));
                providerDecor.setRole(Role.PROVIDER);
                providerDecor.setName("Elegant Decorators");
                providerDecor.setPhoneNumber("+91-7654321098");
                providerDecor.setProviderStatus(ProviderStatus.APPROVED);
                providerDecor.setPortfolioUrl("https://elegantdecorators.example.com");
                userRepository.save(providerDecor);

                User providerMusic = new User();
                providerMusic.setUsername("musicprovider");
                providerMusic.setEmail("music@coordievent.com");
                providerMusic.setPasswordHash(passwordEncoder.encode("provider123"));
                providerMusic.setRole(Role.PROVIDER);
                providerMusic.setName("Symphony Entertainers");
                providerMusic.setPhoneNumber("+91-6543210987");
                providerMusic.setProviderStatus(ProviderStatus.APPROVED);
                providerMusic.setPortfolioUrl("https://symphony.example.com");
                userRepository.save(providerMusic);

                // Sample Customer
                User customer = new User();
                customer.setUsername("customer1");
                customer.setEmail("customer@coordievent.com");
                customer.setPasswordHash(passwordEncoder.encode("customer123"));
                customer.setRole(Role.CUSTOMER);
                customer.setName("John Doe");
                userRepository.save(customer);

                // Categories
                Category venue = new Category();
                venue.setName("Venue");
                venue.setDescription("Beautiful locations for your events");
                venue.setImageUrl("https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=400&q=80");
                venue = categoryRepository.save(venue);

                Category food = new Category();
                food.setName("Food");
                food.setDescription("Delicious catering options");
                food.setImageUrl("https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=400&q=80");
                food = categoryRepository.save(food);

                Category decor = new Category();
                decor.setName("Decor");
                decor.setDescription("Stunning decorations");
                decor.setImageUrl("https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=400&q=80");
                decor = categoryRepository.save(decor);
                
                Category music = new Category();
                music.setName("Music");
                music.setDescription("DJs, Bands, and live music");
                music.setImageUrl("https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=400&q=80");
                music = categoryRepository.save(music);

                // Service Types
                ServiceType banquet = new ServiceType();
                banquet.setCategory(venue);
                banquet.setName("Banquet Hall");
                banquet.setDescription("Indoor AC halls");
                banquet = serviceTypeRepository.save(banquet);

                ServiceType vegFood = new ServiceType();
                vegFood.setCategory(food);
                vegFood.setName("Pure Veg Buffet");
                vegFood.setDescription("100% Vegetarian options");
                vegFood = serviceTypeRepository.save(vegFood);

                ServiceType floral = new ServiceType();
                floral.setCategory(decor);
                floral.setName("Floral Theme");
                floral.setDescription("Fresh flower decorations");
                floral = serviceTypeRepository.save(floral);

                ServiceType liveBand = new ServiceType();
                liveBand.setCategory(music);
                liveBand.setName("Live Band");
                liveBand.setDescription("Live acoustic and electronic bands");
                liveBand = serviceTypeRepository.save(liveBand);

                ServiceType outdoorLawn = new ServiceType();
                outdoorLawn.setCategory(venue);
                outdoorLawn.setName("Outdoor Lawn");
                outdoorLawn.setDescription("Spacious green lawns for outdoor events");
                outdoorLawn = serviceTypeRepository.save(outdoorLawn);

                // Sample Services - VENUES
                Service service1 = new Service();
                service1.setProvider(providerVenue);
                service1.setCategory(venue);
                service1.setTitle("Royal Orchid Banquet");
                service1.setDescription("Premium A/C Banquet with elegant lighting. Accommodates: 500 guests.");
                service1.setLocation("Bangalore");
                service1.setPrice(new BigDecimal("150000.00"));
                service1.setBookingType(BookingType.DAILY);
                service1.setImageUrl("https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=400&q=80");
                serviceRepository.save(service1);

                Service service2 = new Service();
                service2.setProvider(providerVenue);
                service2.setCategory(venue);
                service2.setTitle("The Crystal Room Resort");
                service2.setDescription("Luxury beachside indoor resort hall. Accommodates: 1200 guests.");
                service2.setLocation("Mumbai");
                service2.setPrice(new BigDecimal("450000.00"));
                service2.setBookingType(BookingType.DAILY);
                service2.setImageUrl("https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=400&q=80");
                serviceRepository.save(service2);

                Service service3 = new Service();
                service3.setProvider(providerVenue);
                service3.setCategory(venue);
                service3.setTitle("Nizam Palace Grounds");
                service3.setDescription("Spacious historic green lawns for outdoor events. Accommodates: 2000 guests.");
                service3.setLocation("Hyderabad");
                service3.setPrice(new BigDecimal("200000.00"));
                service3.setBookingType(BookingType.MULTI_DAY);
                service3.setImageUrl("https://images.unsplash.com/photo-1545300063-e3c3b0eb62ea?auto=format&fit=crop&w=400&q=80");
                serviceRepository.save(service3);
                
                Service service4 = new Service();
                service4.setProvider(providerVenue);
                service4.setCategory(venue);
                service4.setTitle("Skyline Rooftop Lounge");
                service4.setDescription("Intimate open-air venue with city skyline views. Accommodates: 150 guests.");
                service4.setLocation("Bangalore");
                service4.setPrice(new BigDecimal("75000.00"));
                service4.setBookingType(BookingType.HOURLY);
                service4.setImageUrl("https://images.unsplash.com/photo-1561501878-aabd62634533?auto=format&fit=crop&w=400&q=80");
                serviceRepository.save(service4);

                Service service5 = new Service();
                service5.setProvider(providerVenue);
                service5.setCategory(venue);
                service5.setTitle("Bandra Heritage Villa");
                service5.setDescription("Classic colonial aesthetic villa for private occasions. Accommodates: 80 guests.");
                service5.setLocation("Mumbai");
                service5.setPrice(new BigDecimal("120000.00"));
                service5.setBookingType(BookingType.DAILY);
                service5.setImageUrl("https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=400&q=80");
                serviceRepository.save(service5);

                // Sample Services - FOOD
                Service service6 = new Service();
                service6.setProvider(providerFood);
                service6.setCategory(food);
                service6.setTitle("Grand Maharaja Catering");
                service6.setDescription("Authentic Indian vegetarian buffet including starters and desserts. Serves up to: 500 people.");
                service6.setLocation("Bangalore");
                service6.setPrice(new BigDecimal("125000.00")); 
                service6.setBookingType(BookingType.DAILY);
                service6.setImageUrl("https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=400&q=80");
                serviceRepository.save(service6);

                Service service7 = new Service();
                service7.setProvider(providerFood);
                service7.setCategory(food);
                service7.setTitle("Coastal Mumbai Seafood Feast");
                service7.setDescription("Exclusive coastal seafood delicacies with live grills. Serves up to: 200 people.");
                service7.setLocation("Mumbai");
                service7.setPrice(new BigDecimal("180000.00")); 
                service7.setBookingType(BookingType.DAILY);
                service7.setImageUrl("https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=400&q=80");
                serviceRepository.save(service7);

                Service service8 = new Service();
                service8.setProvider(providerFood);
                service8.setCategory(food);
                service8.setTitle("Nawabi Biryani Service");
                service8.setDescription("World-class Dum Biryani and Mughlai cuisine. Serves up to: 1000 people.");
                service8.setLocation("Hyderabad");
                service8.setPrice(new BigDecimal("300000.00")); 
                service8.setBookingType(BookingType.DAILY);
                service8.setImageUrl("https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=400&q=80");
                serviceRepository.save(service8);

                Service service9 = new Service();
                service9.setProvider(providerFood);
                service9.setCategory(food);
                service9.setTitle("Continental Mini-Bites");
                service9.setDescription("High-end hors d'oeuvres and cocktails. Serves up to: 100 people.");
                service9.setLocation("Bangalore");
                service9.setPrice(new BigDecimal("80000.00")); 
                service9.setBookingType(BookingType.HOURLY);
                service9.setImageUrl("https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=400&q=80");
                serviceRepository.save(service9);

                Service service10 = new Service();
                service10.setProvider(providerFood);
                service10.setCategory(food);
                service10.setTitle("Mumbai Street Chaat Counter");
                service10.setDescription("Live street food counters serving panipuri, pav bhaji. Serves up to: 300 people.");
                service10.setLocation("Mumbai");
                service10.setPrice(new BigDecimal("60000.00")); 
                service10.setBookingType(BookingType.DAILY);
                service10.setImageUrl("https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80");
                serviceRepository.save(service10);

                // Sample Services - DECOR
                Service service11 = new Service();
                service11.setProvider(providerDecor);
                service11.setCategory(decor);
                service11.setTitle("Elegance Floral Stage");
                service11.setDescription("Beautiful fresh red roses and orchid stage decoration.");
                service11.setLocation("Bangalore");
                service11.setPrice(new BigDecimal("45000.00"));
                service11.setBookingType(BookingType.DAILY);
                service11.setImageUrl("https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=400&q=80");
                serviceRepository.save(service11);

                Service service12 = new Service();
                service12.setProvider(providerDecor);
                service12.setCategory(decor);
                service12.setTitle("Bollywood Light Setup");
                service12.setDescription("Intense thematic lighting, disco balls, and LED dance floors.");
                service12.setLocation("Mumbai");
                service12.setPrice(new BigDecimal("85000.00"));
                service12.setBookingType(BookingType.DAILY);
                service12.setImageUrl("https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=400&q=80");
                serviceRepository.save(service12);

                Service service13 = new Service();
                service13.setProvider(providerDecor);
                service13.setCategory(decor);
                service13.setTitle("Nizami Royal Wedding Theme");
                service13.setDescription("Complete end-to-end royal aesthetic decoration including gold trim.");
                service13.setLocation("Hyderabad");
                service13.setPrice(new BigDecimal("150000.00"));
                service13.setBookingType(BookingType.DAILY);
                service13.setImageUrl("https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=400&q=80");
                serviceRepository.save(service13);
                
                Service service14 = new Service();
                service14.setProvider(providerDecor);
                service14.setCategory(decor);
                service14.setTitle("Minimalist White Setup");
                service14.setDescription("Modern minimalist aesthetic with white drapes and subtle fairy lights.");
                service14.setLocation("Bangalore");
                service14.setPrice(new BigDecimal("30000.00"));
                service14.setBookingType(BookingType.HOURLY);
                service14.setImageUrl("https://images.unsplash.com/photo-1505909182942-e2f09aee3e89?auto=format&fit=crop&w=400&q=80");
                serviceRepository.save(service14);

                // Sample Services - MUSIC
                Service service15 = new Service();
                service15.setProvider(providerMusic);
                service15.setCategory(music);
                service15.setTitle("Symphony Live Acoustic Band");
                service15.setDescription("Professional live acoustic band playing modern pop and classic hits.");
                service15.setLocation("Bangalore");
                service15.setPrice(new BigDecimal("35000.00"));
                service15.setBookingType(BookingType.HOURLY);
                service15.setImageUrl("https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=400&q=80");
                serviceRepository.save(service15);

                Service service16 = new Service();
                service16.setProvider(providerMusic);
                service16.setCategory(music);
                service16.setTitle("DJ Electro Mumbai");
                service16.setDescription("High energy DJ setup specializing in EDM and Bollywood remixes.");
                service16.setLocation("Mumbai");
                service16.setPrice(new BigDecimal("25000.00"));
                service16.setBookingType(BookingType.HOURLY);
                service16.setImageUrl("https://images.unsplash.com/photo-1525362081669-2b476bb628c3?auto=format&fit=crop&w=400&q=80");
                serviceRepository.save(service16);

                Service service17 = new Service();
                service17.setProvider(providerMusic);
                service17.setCategory(music);
                service17.setTitle("Classical Carnatic Setup");
                service17.setDescription("Traditional classical singers and instrumentalists for ceremonies.");
                service17.setLocation("Hyderabad");
                service17.setPrice(new BigDecimal("40000.00"));
                service17.setBookingType(BookingType.DAILY);
                service17.setImageUrl("https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80");
                serviceRepository.save(service17);
                
                Service service18 = new Service();
                service18.setProvider(providerMusic);
                service18.setCategory(music);
                service18.setTitle("Jazz Lounge Trio");
                service18.setDescription("Smooth background jazz for networking events and high-end dinners.");
                service18.setLocation("Bangalore");
                service18.setPrice(new BigDecimal("18000.00"));
                service18.setBookingType(BookingType.HOURLY);
                service18.setImageUrl("https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=400&q=80");
                serviceRepository.save(service18);

                // Sample Booking
                if (bookingRepository.count() == 0) {
                    Booking pendingBooking = new Booking();
                    pendingBooking.setCustomer(customer);
                    pendingBooking.setService(service4); // The Crystal Room
                    pendingBooking.setStartDate(java.time.LocalDate.now().plusDays(10));
                    pendingBooking.setEndDate(java.time.LocalDate.now().plusDays(10));
                    pendingBooking.setTotalPrice(service4.getPrice());
                    pendingBooking.setStatus(BookingStatus.PENDING);
                    bookingRepository.save(pendingBooking);
                }
            }
        };
    }
}
