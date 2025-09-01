import { motion } from 'framer-motion';
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';

const SocialMediaIcons = () => {
  const socialLinks = [
    { 
      icon: <Facebook className="h-5 w-5" />, 
      url: 'https://www.facebook.com/profile.php?id=61555861660075',
      label: 'Facebook'
    },
    // { 
    //   icon: <Twitter className="h-5 w-5" />, 
    //   url: 'https://twitter.com',
    //   label: 'Twitter'
    // },
    { 
      icon: <Instagram className="h-5 w-5" />, 
      url: 'https://www.instagram.com/pana_academy/',
      label: 'Instagram'
    },
    { 
      icon: <Linkedin className="h-5 w-5" />, 
      url: 'https://www.linkedin.com/company/pana-academy/',
      label: 'LinkedIn'
    },
    // { 
    //   icon: <Youtube className="h-5 w-5" />, 
    //   url: 'https://youtube.com',
    //   label: 'YouTube'
    // },
  ];

  return (
    <motion.div 
      className="fixed right-0 top-1/2 transform -translate-y-1/2 z-50 hidden md:flex flex-col gap-4 p-2 bg-white/80 backdrop-blur-sm rounded-l-lg shadow-lg"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 15 }}
    >
      {socialLinks.map((social, index) => (
        <motion.a
          key={social.label}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 text-gray-700 hover:text-blue-600 transition-colors duration-300"
          whileHover={{ scale: 1.1, x: -5 }}
          aria-label={social.label}
          title={social.label}
        >
          {social.icon}
          <span className="sr-only">{social.label}</span>
        </motion.a>
      ))}
    </motion.div>
  );
};

export default SocialMediaIcons;
