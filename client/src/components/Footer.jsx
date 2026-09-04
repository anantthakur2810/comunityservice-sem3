import { Link } from 'react-router-dom';
import { IconInstagram, IconFacebook, IconX, IconYouTube, IconLinkedIn, IconMapPin, IconPhone } from './Icons.jsx';

const socials = [
  { label: 'Instagram', href: 'https://www.instagram.com/dpsngoindia', Icon: IconInstagram },
  { label: 'Facebook', href: 'https://www.facebook.com/dpsngo', Icon: IconFacebook },
  { label: 'X / Twitter', href: 'https://x.com/DpsNgo', Icon: IconX },
  { label: 'YouTube', href: 'https://youtube.com/@dpsngo', Icon: IconYouTube },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/dpsngo', Icon: IconLinkedIn },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <img src="/logo.jpg" alt="DPS Shiksha Samiti NGO logo" className="footer-logo" />
          <p className="footer-tagline">
            Education for every child. Helping underprivileged kids — join us to change lives.
          </p>
        </div>
        <div>
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/volunteer">Volunteer with us</Link></li>
            <li><Link to="/support">Donate / Support</Link></li>
            <li><Link to="/contact">Contact us</Link></li>
            <li><Link to="/admin">Admin panel</Link></li>
          </ul>
        </div>
        <div>
          <h4>Contact</h4>
          <ul className="footer-links footer-contact">
            <li>
              <IconMapPin size={15} />
              <span>Village Sadarpur, Sector 45, Near Indian Overseas Bank, Noida 201301</span>
            </li>
            <li>
              <IconPhone size={15} />
              <a href="tel:+919873965604">+91 98739 65604</a>
            </li>
          </ul>
        </div>
        <div>
          <h4>Follow Us</h4>
          <div className="footer-socials">
            {socials.map(({ label, href, Icon }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" title={label}>
                <span className="social-icon">
                  <Icon size={16} />
                </span>
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          © {new Date().getFullYear()} DPS Shiksha Samiti NGO · शिक्षा ही एकमात्र ऐसी पूंजी है, जो
          लुटती नहीं, बल्कि बढ़ती है
        </div>
      </div>
    </footer>
  );
}