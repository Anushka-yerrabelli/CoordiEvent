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
                service3.setImageUrl("data:image/jpeg;base64,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");
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
