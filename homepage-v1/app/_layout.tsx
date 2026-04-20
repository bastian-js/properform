import { Slot, useRouter, usePathname } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, useWindowDimensions } from 'react-native';
import { useState } from 'react';
import Footer from '../components/footer';
import { ThemeProvider, useTheme } from './ThemeContext';

function MainLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const { isDarkMode, toggleTheme, theme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;
  const hideFooter = pathname === "/login" || pathname === "/dashboard";

  const handleNavigation = (path: string) => {
    router.push(path as any);
    setIsMenuOpen(false);
  };

  return (
      <View style={[styles.mainWrapper, { backgroundColor: theme.bg }]}>
        <View style={[styles.navbar, isMobile && styles.navbarMobile, { backgroundColor: theme.nav, borderBottomColor: theme.border }]}>
          <Text style={styles.brand}>ProPerform</Text>

          {!isMobile ? (
              <View style={styles.rightBlock}>
                <TouchableOpacity onPress={toggleTheme} style={[styles.themeToggle, { backgroundColor: theme.btnGray }]}>
                  <Text style={styles.themeToggleText}>{isDarkMode ? "☀️" : "🌙"}</Text>
                </TouchableOpacity>

                <View style={styles.links}>
                  <NavItem label="Home" active={isActive('/')} onPress={() => handleNavigation('/')} theme={theme} />
                  <NavItem label="Features" active={isActive('/features')} onPress={() => handleNavigation('/features')} theme={theme} />
                  <NavItem label="Download" active={isActive('/download')} onPress={() => handleNavigation('/download')} theme={theme} />
                  <NavItem label="Über uns" active={isActive('/about')} onPress={() => handleNavigation('/about')} theme={theme} />
                </View>

                <View style={styles.divider} />

                <TouchableOpacity style={styles.loginButton} onPress={() => handleNavigation('/login')}>
                  <Image source={require('../assets/images/profile.png')} style={styles.profileIcon} />
                  <Text style={styles.loginText}>Trainer Login</Text>
                </TouchableOpacity>
              </View>
          ) : (
              <View style={styles.mobileActions}>
                <TouchableOpacity onPress={toggleTheme} style={[styles.themeToggle, { backgroundColor: theme.btnGray }]}>
                  <Text style={styles.themeToggleText}>{isDarkMode ? "☀️" : "🌙"}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setIsMenuOpen(!isMenuOpen)} style={styles.hamburgerBtn}>
                  <Text style={styles.hamburgerIcon}>{isMenuOpen ? '✕' : '☰'}</Text>
                </TouchableOpacity>
              </View>
          )}
        </View>

        {isMobile && isMenuOpen && (
            <View style={[styles.mobileMenu, { backgroundColor: theme.nav, borderBottomColor: theme.border }]}>
              <NavItem label="Home" active={isActive('/')} onPress={() => handleNavigation('/')} isMobile theme={theme} />
              <NavItem label="Features" active={isActive('/features')} onPress={() => handleNavigation('/features')} isMobile theme={theme} />
              <NavItem label="Download" active={isActive('/download')} onPress={() => handleNavigation('/download')} isMobile theme={theme} />
              <NavItem label="Über uns" active={isActive('/about')} onPress={() => handleNavigation('/about')} isMobile theme={theme} />
              <View style={styles.mobileDivider} />
              <TouchableOpacity style={styles.mobileLoginBtn} onPress={() => handleNavigation('/login')}>
                <Text style={styles.mobileLoginText}>Trainer Login</Text>
              </TouchableOpacity>
            </View>
        )}

        <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
          <View style={styles.pageContent}>
            <Slot />
          </View>
          {!hideFooter && <Footer />}
        </ScrollView>
      </View>
  );
}

function NavItem({ label, active, onPress, isMobile, theme }: any) {
  return (
      <TouchableOpacity onPress={onPress} style={[styles.navItem, active && styles.navItemActive, isMobile && styles.navItemMobile]}>
        <Text style={[styles.link, { color: active ? '#F97316' : '#CBD5E1' }, active && styles.activeText, isMobile && styles.linkMobile]}>
          {label}
        </Text>
      </TouchableOpacity>
  );
}

export default function Layout() {
  return (
      <ThemeProvider>
        <MainLayout />
      </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
  },
  navbar: {
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    zIndex: 100,
    borderBottomWidth: 1,
    elevation: 5,
  },
  navbarMobile: {
    paddingHorizontal: 20,
  },
  brand: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  rightBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  themeToggle: {
    padding: 8,
    borderRadius: 20,
  },
  themeToggleText: {
    fontSize: 16,
  },
  links: {
    flexDirection: 'row',
    gap: 8,
  },
  navItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  navItemActive: {
    backgroundColor: 'rgba(249,115,22,0.15)',
  },
  navItemMobile: {
    paddingVertical: 12,
    marginBottom: 4,
  },
  link: {
    fontSize: 16,
    fontWeight: '500',
  },
  activeText: {
    fontWeight: 'bold',
  },
  linkMobile: {
    fontSize: 18,
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F97316',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    gap: 10,
  },
  profileIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  loginText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },
  mobileActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  hamburgerBtn: {
    padding: 8,
  },
  hamburgerIcon: {
    color: 'white',
    fontSize: 28,
  },
  mobileMenu: {
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
    padding: 20,
    zIndex: 99,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomWidth: 1,
    elevation: 10,
  },
  mobileDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: 10,
  },
  mobileLoginBtn: {
    backgroundColor: '#F97316',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  mobileLoginText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    flexDirection: 'column',
  },
  pageContent: {
    flex: 1,
  },
});