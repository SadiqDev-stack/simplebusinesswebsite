import { Link } from 'react-router-dom';
import { Button } from '../components/FormComponents';
import { 
  MessageCircle, Award, Truck, Shield, Star, Mail, Phone, 
  MapPin, Clock, CreditCard, RotateCcw, ChevronRight 
} from 'lucide-react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Navigation } from '../components/Navigation';

export const Landing = () => {
  const products = [
    {
      id: 1,
      name: 'Miyaram',
      description: 'Premium handcrafted cap with unique embroidery and breathable cotton fabric.',
      price: '$29.99',
      image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&h=400&fit=crop',
    },
    {
      id: 2,
      name: 'Elite Series',
      description: 'Luxury collection featuring premium wool blend for the modern professional.',
      price: '$49.99',
      image: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=600&h=400&fit=crop',
    },
    {
      id: 3,
      name: 'Sport Pro',
      description: 'High-performance athletic cap with advanced sweat-wicking technology.',
      price: '$34.99',
      image: 'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=600&h=400&fit=crop',
    },
    {
      id: 4,
      name: 'Urban Edge',
      description: 'Streetwear inspired cap with bold designs and premium aesthetics.',
      price: '$44.99',
      image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&h=400&fit=crop',
    },
    {
      id: 5,
      name: 'Heritage',
      description: 'Classic vintage design crafted from sustainable materials.',
      price: '$39.99',
      image: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=600&h=400&fit=crop',
    },
    {
      id: 6,
      name: 'Executive',
      description: 'Sophisticated cap featuring premium materials and refined details.',
      price: '$59.99',
      image: 'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=600&h=400&fit=crop',
    }
  ];

  const features = [
    { icon: <Award className="w-6 h-6" />, title: 'Premium Quality', description: 'Finest materials for durability and comfort' },
    { icon: <Truck className="w-6 h-6" />, title: 'Free Shipping', description: 'On orders over $50' },
    { icon: <MessageCircle className="w-6 h-6" />, title: '24/7 Support', description: 'Always here to help you' },
    { icon: <Shield className="w-6 h-6" />, title: '2 Year Warranty', description: 'Quality guaranteed' },
    { icon: <CreditCard className="w-6 h-6" />, title: 'Secure Payment', description: '100% safe transactions' },
    { icon: <RotateCcw className="w-6 h-6" />, title: 'Easy Returns', description: '30-day return policy' }
  ];

  const testimonials = [
    { name: 'Sarah Johnson', role: 'Fashion Blogger', rating: 5, text: 'The Miyaram cap exceeded my expectations! Amazing quality and comfort.', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
    { name: 'Michael Chen', role: 'Pro Athlete', rating: 5, text: 'Best sports cap I\'ve ever used. Perfect for my training sessions.', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
    { name: 'Emma Davis', role: 'CEO, TechStart', rating: 5, text: 'Executive series is pure luxury. Highly recommend Sadiq Caps!', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop' }
  ];

  return (


    <div>   


      {/* Hero Section */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-full mb-6">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-sm text-gray-300">
                  Premium Quality Since 2020
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Premium Quality
                <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Caps & Headwear
                </span>
              </h1>
              <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                Welcome to Sadiq Caps - Your ultimate destination for premium
                quality caps, hats, and custom headwear. We combine style,
                comfort, and durability in every piece.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/contact">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    Contact Us{" "}
                    <ChevronRight className="inline-block ml-2 w-4 h-4" />
                  </Button>
                </Link>
          
              </div>

              <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-gray-800">
                <div>
                  <div className="text-2xl font-bold text-purple-400">
                    5000+
                  </div>
                  <div className="text-sm text-gray-500">Happy Customers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-400">50+</div>
                  <div className="text-sm text-gray-500">Unique Designs</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-400">4.9★</div>
                  <div className="text-sm text-gray-500">Rating</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&h=600&fit=crop"
                  alt="Premium Caps"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-5 -left-5 bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🏆</span>
                  <div>
                    <div className="font-semibold">Award Winning</div>
                    <div className="text-sm text-gray-400">
                      Best Cap Brand 2024
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-16 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                About{" "}
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Sadiq Caps
                </span>
              </h2>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Founded in 2020, Sadiq Caps has grown to become a leading
                premium headwear brand, known for exceptional quality and
                innovative designs. We believe that a great cap is more than
                just an accessory - it's a statement of style and personality.
              </p>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Our mission is to provide customers with high-quality, stylish
                caps that combine comfort, durability, and modern aesthetics.
                Every cap is crafted with attention to detail and the finest
                materials.
              </p>
              <div className="flex gap-4">
          
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=400&h=300&fit=crop"
                alt="Cap making"
                className="rounded-lg"
              />
              <img
                src="https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=400&h=300&fit=crop"
                alt="Cap display"
                className="rounded-lg mt-8"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Premium Collections
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Discover our curated selection of high-quality caps designed for
              every occasion
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="group bg-gray-900 rounded-xl overflow-hidden hover:transform hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-pink-600 px-3 py-1 rounded-full text-sm font-semibold">
                    {product.price}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    {product.description}
                  </p>
                  <Link to='/contact'>
                  <button className="w-full px-4 py-2 border border-gray-700 rounded-lg hover:bg-purple-600 hover:border-purple-600 transition-all duration-300">
                    learn more
                  </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
 
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Trust{" "}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Sadiq Caps?
              </span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              We're committed to providing the best experience for our customers
            </p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="text-center p-6 bg-gray-800 rounded-xl hover:bg-gray-750 transition-all"
              >
                <div className="text-purple-400 mb-3 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-sm mb-2">{feature.title}</h3>
                <p className="text-xs text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our{" "}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Customers Say
              </span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Join thousands of satisfied customers who love our products
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-gray-900 p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">
                      {testimonial.role}
                    </div>
                    <div className="flex gap-1 mt-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-3 h-3 fill-current text-yellow-500"
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  "{testimonial.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-gray-400 mb-8 text-lg">
            Have questions about our products or need help with your order? Our
            team is here to assist you 24/7.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600"
              >
                Contact Us Today
              </Button>
            </Link>
  
          </div>
        </div>
      </section>

      {/* Contact Section with Form */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Get In Touch</h2>
              <p className="text-gray-400 mb-8">
                We'd love to hear from you. Send us a message and we'll respond
                within 24 hours.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-purple-400" />
                  <span className="text-gray-300">hello@sadiqcaps.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-purple-400" />
                  <span className="text-gray-300">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-purple-400" />
                  <span className="text-gray-300">
                    123 Fashion Ave, New York, NY 10001
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-purple-400" />
                  <span className="text-gray-300">Mon-Fri: 9AM - 6PM EST</span>
                </div>
              </div>
            </div>
            <div>
      
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🧢</span>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Sadiq Caps
                </span>
              </div>
              <p className="text-gray-400 text-sm">
                Premium quality caps and headwear since 2020.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
             
                <li>
                  <Link
                    to="/contact"
                    className="hover:text-purple-400 transition"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
          </div>
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <FaFacebook className="w-5 h-5" />
                <FaTwitter className="w-5 h-5" />
                <FaInstagram className="w-5 h-5" />
                <FaLinkedin className="w-5 h-5" />{" "}
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
            <p>&copy; 2024 Sadiq Caps. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};