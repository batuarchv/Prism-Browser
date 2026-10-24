(function(root){
const catalog={
 "What’s New": {
  "tr": "Yenilikler",
  "es": "Novedades",
  "pt": "Novidades",
  "fr": "Nouveautés",
  "uk": "Що нового"
 },
 "Restart": {
  "tr": "Yeniden başlat",
  "es": "Reiniciar",
  "pt": "Reiniciar",
  "fr": "Redémarrer",
  "uk": "Перезапустити"
 },
 "Restart to Update": {
  "tr": "Güncellemek için yeniden başlat",
  "es": "Reiniciar para actualizar",
  "pt": "Reiniciar para atualizar",
  "fr": "Redémarrer pour mettre à jour",
  "uk": "Перезапустити для оновлення"
 },
 "Downloading update": {
  "tr": "Güncelleme indiriliyor",
  "es": "Descargando actualización",
  "pt": "A transferir atualização",
  "fr": "Téléchargement de la mise à jour",
  "uk": "Завантаження оновлення"
 },
 "Updated to Prism {version}": {
  "tr": "Prism {version} sürümüne güncellendi",
  "es": "Actualizado a Prism {version}",
  "pt": "Atualizado para Prism {version}",
  "fr": "Mis à jour vers Prism {version}",
  "uk": "Оновлено до Prism {version}"
 },
 "Open side panel": {
  "tr": "Yan paneli aç",
  "es": "Abrir panel lateral",
  "pt": "Abrir painel lateral",
  "fr": "Ouvrir le panneau latéral",
  "uk": "Відкрити бічну панель"
 },
 "Close side panel": {
  "tr": "Yan paneli kapat",
  "es": "Cerrar panel lateral",
  "pt": "Fechar painel lateral",
  "fr": "Fermer le panneau latéral",
  "uk": "Закрити бічну панель"
 },
 "Extension side panel": {
  "tr": "Uzantı yan paneli",
  "es": "Panel lateral de la extensión",
  "pt": "Painel lateral da extensão",
  "fr": "Panneau latéral de l’extension",
  "uk": "Бічна панель розширення"
 },
 "Resize side panel": {
  "tr": "Yan paneli yeniden boyutlandır",
  "es": "Cambiar tamaño del panel lateral",
  "pt": "Redimensionar painel lateral",
  "fr": "Redimensionner le panneau latéral",
  "uk": "Змінити розмір бічної панелі"
 },
 "This extension has no side panel.": {
  "tr": "Bu uzantının yan paneli yok.",
  "es": "Esta extensión no tiene panel lateral.",
  "pt": "Esta extensão não tem painel lateral.",
  "fr": "Cette extension n’a pas de panneau latéral.",
  "uk": "Це розширення не має бічної панелі."
 },
 "Open a page first.": {
  "tr": "Önce bir sayfa açın.",
  "es": "Abre primero una página.",
  "pt": "Abra primeiro uma página.",
  "fr": "Ouvrez d’abord une page.",
  "uk": "Спершу відкрийте сторінку."
 },
 "Extension": {
  "tr": "Uzantı",
  "es": "Extensión",
  "pt": "Extensão",
  "fr": "Extension",
  "uk": "Розширення"
 },
 "Settings": {
  "tr": "Ayarlar",
  "es": "Ajustes",
  "pt": "Definições",
  "fr": "Réglages",
  "uk": "Налаштування"
 },
 "Settings…": {
  "tr": "Ayarlar…",
  "es": "Ajustes…",
  "pt": "Definições…",
  "fr": "Réglages…",
  "uk": "Налаштування…"
 },
 "Appearance": {
  "tr": "Görünüm",
  "es": "Apariencia",
  "pt": "Aparência",
  "fr": "Apparence",
  "uk": "Вигляд"
 },
 "Accessibility": {
  "tr": "Erişilebilirlik",
  "es": "Accesibilidad",
  "pt": "Acessibilidade",
  "fr": "Accessibilité",
  "uk": "Доступність"
 },
 "Performance": {
  "tr": "Performans",
  "es": "Rendimiento",
  "pt": "Desempenho",
  "fr": "Performances",
  "uk": "Продуктивність"
 },
 "Extensions": {
  "tr": "Uzantılar",
  "es": "Extensiones",
  "pt": "Extensões",
  "fr": "Extensions",
  "uk": "Розширення"
 },
 "Passwords": {
  "tr": "Parolalar",
  "es": "Contraseñas",
  "pt": "Palavras-passe",
  "fr": "Mots de passe",
  "uk": "Паролі"
 },
 "Downloads": {
  "tr": "İndirilenler",
  "es": "Descargas",
  "pt": "Transferências",
  "fr": "Téléchargements",
  "uk": "Завантаження"
 },
 "Private network": {
  "tr": "Özel ağ",
  "es": "Red privada",
  "pt": "Rede privada",
  "fr": "Réseau privé",
  "uk": "Приватна мережа"
 },
 "Imports": {
  "tr": "İçe aktarma",
  "es": "Importaciones",
  "pt": "Importações",
  "fr": "Importations",
  "uk": "Імпорт"
 },
 "History": {
  "tr": "Geçmiş",
  "es": "Historial",
  "pt": "Histórico",
  "fr": "Historique",
  "uk": "Історія"
 },
 "Site permissions": {
  "tr": "Site izinleri",
  "es": "Permisos de sitios",
  "pt": "Permissões dos sites",
  "fr": "Autorisations des sites",
  "uk": "Дозволи сайтів"
 },
 "Design Studio": {
  "tr": "Tasarım Stüdyosu",
  "es": "Estudio de diseño",
  "pt": "Estúdio de design",
  "fr": "Studio de design",
  "uk": "Студія дизайну"
 },
 "Updates": {
  "tr": "Güncellemeler",
  "es": "Actualizaciones",
  "pt": "Atualizações",
  "fr": "Mises à jour",
  "uk": "Оновлення"
 },
 "Language": {
  "tr": "Dil",
  "es": "Idioma",
  "pt": "Idioma",
  "fr": "Langue",
  "uk": "Мова"
 },
 "Browser interface language.": {
  "tr": "Tarayıcı arayüz dili.",
  "es": "Idioma de la interfaz del navegador.",
  "pt": "Idioma da interface do navegador.",
  "fr": "Langue de l’interface du navigateur.",
  "uk": "Мова інтерфейсу браузера."
 },
 "Personal": {
  "tr": "Kişisel",
  "es": "Personal",
  "pt": "Pessoal",
  "fr": "Personnel",
  "uk": "Особистий"
 },
 "Work": {
  "tr": "İş",
  "es": "Trabajo",
  "pt": "Trabalho",
  "fr": "Travail",
  "uk": "Робочий"
 },
 "Private": {
  "tr": "Özel",
  "es": "Privado",
  "pt": "Privado",
  "fr": "Privé",
  "uk": "Приватний"
 },
 "End Private": {
  "tr": "Özel oturumu bitir",
  "es": "Finalizar sesión privada",
  "pt": "Terminar sessão privada",
  "fr": "Terminer la session privée",
  "uk": "Завершити приватний сеанс"
 },
 "New tab": {
  "tr": "Yeni sekme",
  "es": "Nueva pestaña",
  "pt": "Novo separador",
  "fr": "Nouvel onglet",
  "uk": "Нова вкладка"
 },
 "PINNED": {
  "tr": "SABİTLENENLER",
  "es": "FIJADAS",
  "pt": "FIXADOS",
  "fr": "ÉPINGLÉS",
  "uk": "ЗАКРІПЛЕНІ"
 },
 "OPEN TABS": {
  "tr": "AÇIK SEKMELER",
  "es": "PESTAÑAS ABIERTAS",
  "pt": "SEPARADORES ABERTOS",
  "fr": "ONGLETS OUVERTS",
  "uk": "ВІДКРИТІ ВКЛАДКИ"
 },
 "Add bookmark": {
  "tr": "Yer imi ekle",
  "es": "Añadir marcador",
  "pt": "Adicionar marcador",
  "fr": "Ajouter un favori",
  "uk": "Додати закладку"
 },
 "New folder": {
  "tr": "Yeni klasör",
  "es": "Nueva carpeta",
  "pt": "Nova pasta",
  "fr": "Nouveau dossier",
  "uk": "Нова тека"
 },
 "Back": {
  "tr": "Geri",
  "es": "Atrás",
  "pt": "Voltar",
  "fr": "Retour",
  "uk": "Назад"
 },
 "Forward": {
  "tr": "İleri",
  "es": "Adelante",
  "pt": "Avançar",
  "fr": "Suivant",
  "uk": "Вперед"
 },
 "Reload": {
  "tr": "Yenile",
  "es": "Recargar",
  "pt": "Recarregar",
  "fr": "Actualiser",
  "uk": "Перезавантажити"
 },
 "Reload (⌘R)": {
  "tr": "Yenile (⌘R)",
  "es": "Recargar (⌘R)",
  "pt": "Recarregar (⌘R)",
  "fr": "Actualiser (⌘R)",
  "uk": "Перезавантажити (⌘R)"
 },
 "Address or search": {
  "tr": "Adres veya arama",
  "es": "Dirección o búsqueda",
  "pt": "Endereço ou pesquisa",
  "fr": "Adresse ou recherche",
  "uk": "Адреса або пошук"
 },
 "Search or enter a URL": {
  "tr": "Ara veya adres gir",
  "es": "Busca o introduce una URL",
  "pt": "Pesquisar ou introduzir URL",
  "fr": "Rechercher ou saisir une URL",
  "uk": "Пошук або введення URL"
 },
 "Search the web": {
  "tr": "Web’de ara",
  "es": "Buscar en la web",
  "pt": "Pesquisar na web",
  "fr": "Rechercher sur le Web",
  "uk": "Пошук в інтернеті"
 },
 "Where would you like to go?": {
  "tr": "Nereye gitmek istersin?",
  "es": "¿Adónde quieres ir?",
  "pt": "Para onde quer ir?",
  "fr": "Où souhaitez-vous aller ?",
  "uk": "Куди бажаєте перейти?"
 },
 "Search": {
  "tr": "Ara",
  "es": "Buscar",
  "pt": "Pesquisar",
  "fr": "Rechercher",
  "uk": "Пошук"
 },
 "Bookmark this page": {
  "tr": "Bu sayfayı yer imlerine ekle",
  "es": "Guardar esta página",
  "pt": "Guardar esta página",
  "fr": "Ajouter cette page aux favoris",
  "uk": "Додати сторінку до закладок"
 },
 "Fill a saved password": {
  "tr": "Kayıtlı parolayı doldur",
  "es": "Rellenar contraseña guardada",
  "pt": "Preencher palavra-passe guardada",
  "fr": "Remplir un mot de passe enregistré",
  "uk": "Заповнити збережений пароль"
 },
 "Keep this tab awake": {
  "tr": "Bu sekmeyi uyanık tut",
  "es": "Mantener esta pestaña activa",
  "pt": "Manter este separador ativo",
  "fr": "Garder cet onglet actif",
  "uk": "Залишати цю вкладку активною"
 },
 "Tab stays awake — click to allow sleeping": {
  "tr": "Sekme uyanık — uyutmak için tıkla",
  "es": "Pestaña activa: pulsa para permitir suspensión",
  "pt": "Separador ativo: clique para permitir suspensão",
  "fr": "Onglet actif : cliquer pour autoriser la veille",
  "uk": "Вкладка активна — натисніть, щоб дозволити призупинення"
 },
 "Sleep background tabs": {
  "tr": "Arka plan sekmelerini uyut",
  "es": "Suspender pestañas en segundo plano",
  "pt": "Suspender separadores em segundo plano",
  "fr": "Mettre les onglets en arrière-plan en veille",
  "uk": "Призупинити фонові вкладки"
 },
 "Switch color theme": {
  "tr": "Renk temasını değiştir",
  "es": "Cambiar tema de color",
  "pt": "Mudar tema de cor",
  "fr": "Changer le thème de couleur",
  "uk": "Змінити колірну тему"
 },
 "Close settings": {
  "tr": "Ayarları kapat",
  "es": "Cerrar ajustes",
  "pt": "Fechar definições",
  "fr": "Fermer les réglages",
  "uk": "Закрити налаштування"
 },
 "Close dialog": {
  "tr": "Pencereyi kapat",
  "es": "Cerrar diálogo",
  "pt": "Fechar diálogo",
  "fr": "Fermer la boîte de dialogue",
  "uk": "Закрити діалог"
 },
 "Open Design Studio": {
  "tr": "Tasarım Stüdyosunu aç",
  "es": "Abrir estudio de diseño",
  "pt": "Abrir estúdio de design",
  "fr": "Ouvrir le studio de design",
  "uk": "Відкрити студію дизайну"
 },
 "Colors & themes": {
  "tr": "Renkler ve temalar",
  "es": "Colores y temas",
  "pt": "Cores e temas",
  "fr": "Couleurs et thèmes",
  "uk": "Кольори й теми"
 },
 "Match macOS": {
  "tr": "macOS ile eşleştir",
  "es": "Usar macOS",
  "pt": "Seguir macOS",
  "fr": "Suivre macOS",
  "uk": "Як у macOS"
 },
 "Light": {
  "tr": "Açık",
  "es": "Claro",
  "pt": "Claro",
  "fr": "Clair",
  "uk": "Світла"
 },
 "Dark": {
  "tr": "Koyu",
  "es": "Oscuro",
  "pt": "Escuro",
  "fr": "Sombre",
  "uk": "Темна"
 },
 "Follow macOS or choose a look.": {
  "tr": "macOS’u izle veya bir görünüm seç.",
  "es": "Sigue macOS o elige una apariencia.",
  "pt": "Siga o macOS ou escolha um aspeto.",
  "fr": "Suivez macOS ou choisissez une apparence.",
  "uk": "Використовуйте вигляд macOS або виберіть власний."
 },
 "Adjust your browser’s look and spacing.": {
  "tr": "Tarayıcının görünümünü ve boşluklarını ayarla.",
  "es": "Ajusta la apariencia y el espaciado.",
  "pt": "Ajuste a aparência e o espaçamento.",
  "fr": "Réglez l’apparence et l’espacement.",
  "uk": "Налаштуйте вигляд браузера та відступи."
 },
 "Window material": {
  "tr": "Pencere malzemesi",
  "es": "Material de ventana",
  "pt": "Material da janela",
  "fr": "Matériau de la fenêtre",
  "uk": "Матеріал вікна"
 },
 "Regular": {
  "tr": "Standart",
  "es": "Normal",
  "pt": "Normal",
  "fr": "Standard",
  "uk": "Звичайний"
 },
 "Clear": {
  "tr": "Şeffaf",
  "es": "Transparente",
  "pt": "Transparente",
  "fr": "Transparent",
  "uk": "Прозорий"
 },
 "Frosted sidebar": {
  "tr": "Buzlu kenar çubuğu",
  "es": "Barra lateral esmerilada",
  "pt": "Barra lateral fosca",
  "fr": "Barre latérale dépolie",
  "uk": "Матова бічна панель"
 },
 "Solid": {
  "tr": "Düz",
  "es": "Sólido",
  "pt": "Sólido",
  "fr": "Opaque",
  "uk": "Непрозорий"
 },
 "Background opacity": {
  "tr": "Arka plan opaklığı",
  "es": "Opacidad del fondo",
  "pt": "Opacidade do fundo",
  "fr": "Opacité du fond",
  "uk": "Непрозорість тла"
 },
 "Adjust how much shows through the window.": {
  "tr": "Pencerenin saydamlığını ayarla.",
  "es": "Ajusta la transparencia de la ventana.",
  "pt": "Ajuste a transparência da janela.",
  "fr": "Réglez la transparence de la fenêtre.",
  "uk": "Налаштуйте прозорість вікна."
 },
 "Corner radius": {
  "tr": "Köşe yuvarlaklığı",
  "es": "Radio de esquinas",
  "pt": "Raio dos cantos",
  "fr": "Arrondi des coins",
  "uk": "Радіус кутів"
 },
 "Sidebar width": {
  "tr": "Kenar çubuğu genişliği",
  "es": "Ancho de barra lateral",
  "pt": "Largura da barra lateral",
  "fr": "Largeur de la barre latérale",
  "uk": "Ширина бічної панелі"
 },
 "Or drag its right edge. Double-click to reset.": {
  "tr": "Sağ kenarı sürükle. Sıfırlamak için çift tıkla.",
  "es": "O arrastra su borde derecho. Doble clic para restablecer.",
  "pt": "Ou arraste a margem direita. Duplo clique para repor.",
  "fr": "Ou faites glisser le bord droit. Double-cliquez pour réinitialiser.",
  "uk": "Або перетягніть правий край. Подвійне клацання скидає розмір."
 },
 "Spacing": {
  "tr": "Boşluklar",
  "es": "Espaciado",
  "pt": "Espaçamento",
  "fr": "Espacement",
  "uk": "Відступи"
 },
 "Comfortable": {
  "tr": "Rahat",
  "es": "Cómodo",
  "pt": "Confortável",
  "fr": "Confortable",
  "uk": "Зручні"
 },
 "Compact": {
  "tr": "Sıkışık",
  "es": "Compacto",
  "pt": "Compacto",
  "fr": "Compact",
  "uk": "Компактні"
 },
 "Favorites on the home screen": {
  "tr": "Ana ekrandaki favoriler",
  "es": "Favoritos en la pantalla inicial",
  "pt": "Favoritos no ecrã inicial",
  "fr": "Favoris sur l’écran d’accueil",
  "uk": "Обране на початковому екрані"
 },
 "Site icons": {
  "tr": "Site simgeleri",
  "es": "Iconos de sitios",
  "pt": "Ícones dos sites",
  "fr": "Icônes des sites",
  "uk": "Значки сайтів"
 },
 "Preview cards": {
  "tr": "Önizleme kartları",
  "es": "Tarjetas de vista previa",
  "pt": "Cartões de pré-visualização",
  "fr": "Cartes d’aperçu",
  "uk": "Картки попереднього перегляду"
 },
 "Saved favorite images": {
  "tr": "Kayıtlı favori görselleri",
  "es": "Imágenes de favoritos guardadas",
  "pt": "Imagens dos favoritos guardadas",
  "fr": "Images des favoris enregistrées",
  "uk": "Збережені зображення обраного"
 },
 "Clear images": {
  "tr": "Görselleri temizle",
  "es": "Borrar imágenes",
  "pt": "Limpar imagens",
  "fr": "Effacer les images",
  "uk": "Очистити зображення"
 },
 "Clear cached icons and page previews.": {
  "tr": "Önbellekteki simgeleri ve sayfa önizlemelerini temizle.",
  "es": "Borra iconos y vistas previas en caché.",
  "pt": "Limpe ícones e pré-visualizações em cache.",
  "fr": "Effacez les icônes et aperçus en cache.",
  "uk": "Очистіть кеш значків і попередніх переглядів."
 },
 "Comfort comes first": {
  "tr": "Önce konfor",
  "es": "La comodidad es lo primero",
  "pt": "O conforto em primeiro lugar",
  "fr": "Le confort avant tout",
  "uk": "Комфорт передусім"
 },
 "macOS accessibility preferences are always respected.": {
  "tr": "macOS erişilebilirlik tercihleri her zaman uygulanır.",
  "es": "Siempre se respetan las preferencias de accesibilidad de macOS.",
  "pt": "As preferências de acessibilidade do macOS são sempre respeitadas.",
  "fr": "Les préférences d’accessibilité de macOS sont toujours respectées.",
  "uk": "Налаштування доступності macOS завжди враховуються."
 },
 "Larger interface text": {
  "tr": "Daha büyük arayüz metni",
  "es": "Texto de interfaz más grande",
  "pt": "Texto da interface maior",
  "fr": "Texte d’interface agrandi",
  "uk": "Більший текст інтерфейсу"
 },
 "Default page zoom": {
  "tr": "Varsayılan sayfa yakınlaştırması",
  "es": "Zoom predeterminado",
  "pt": "Zoom predefinido",
  "fr": "Zoom par défaut",
  "uk": "Типовий масштаб сторінок"
 },
 "Reduce motion": {
  "tr": "Hareketi azalt",
  "es": "Reducir movimiento",
  "pt": "Reduzir movimento",
  "fr": "Réduire les animations",
  "uk": "Зменшити рух"
 },
 "Remove interface animations.": {
  "tr": "Arayüz animasyonlarını kapat.",
  "es": "Desactiva las animaciones.",
  "pt": "Desative as animações.",
  "fr": "Désactivez les animations.",
  "uk": "Вимкніть анімації інтерфейсу."
 },
 "Reduce transparency": {
  "tr": "Saydamlığı azalt",
  "es": "Reducir transparencia",
  "pt": "Reduzir transparência",
  "fr": "Réduire la transparence",
  "uk": "Зменшити прозорість"
 },
 "Use solid surfaces for predictable contrast.": {
  "tr": "Daha tutarlı kontrast için düz yüzeyler kullan.",
  "es": "Usa superficies opacas para un contraste uniforme.",
  "pt": "Use superfícies opacas para um contraste uniforme.",
  "fr": "Utilisez des surfaces opaques pour un contraste uniforme.",
  "uk": "Використовуйте непрозорі поверхні для сталого контрасту."
 },
 "Increase contrast": {
  "tr": "Kontrastı artır",
  "es": "Aumentar contraste",
  "pt": "Aumentar contraste",
  "fr": "Augmenter le contraste",
  "uk": "Збільшити контраст"
 },
 "Stronger outlines and text separation.": {
  "tr": "Daha belirgin kenarlar ve metin ayrımı.",
  "es": "Bordes y texto más definidos.",
  "pt": "Contornos e texto mais definidos.",
  "fr": "Contours et texte plus marqués.",
  "uk": "Чіткіші контури та текст."
 },
 "A lighter workspace": {
  "tr": "Daha hafif bir çalışma alanı",
  "es": "Un espacio de trabajo más ligero",
  "pt": "Um espaço de trabalho mais leve",
  "fr": "Un espace de travail plus léger",
  "uk": "Легший робочий простір"
 },
 "Keep Chromium responsive with fewer background pages.": {
  "tr": "Daha az arka plan sayfasıyla Chromium’u hızlı tut.",
  "es": "Mantén Chromium ágil con menos páginas en segundo plano.",
  "pt": "Mantenha o Chromium ágil com menos páginas em segundo plano.",
  "fr": "Gardez Chromium réactif avec moins de pages en arrière-plan.",
  "uk": "Зберігайте швидкодію Chromium з меншою кількістю фонових сторінок."
 },
 "Hardware acceleration": {
  "tr": "Donanım hızlandırma",
  "es": "Aceleración de hardware",
  "pt": "Aceleração por hardware",
  "fr": "Accélération matérielle",
  "uk": "Апаратне прискорення"
 },
 "Use the GPU when available. Takes effect after restart.": {
  "tr": "Varsa GPU’yu kullan. Yeniden başlatınca uygulanır.",
  "es": "Usa la GPU si está disponible. Se aplica al reiniciar.",
  "pt": "Use a GPU se disponível. Aplica-se ao reiniciar.",
  "fr": "Utilisez le GPU si disponible. Prend effet au redémarrage.",
  "uk": "Використовуйте GPU, якщо доступний. Діє після перезапуску."
 },
 "Awake tab limit": {
  "tr": "Uyanık sekme sınırı",
  "es": "Límite de pestañas activas",
  "pt": "Limite de separadores ativos",
  "fr": "Limite d’onglets actifs",
  "uk": "Ліміт активних вкладок"
 },
 "No limit": {
  "tr": "Sınırsız",
  "es": "Sin límite",
  "pt": "Sem limite",
  "fr": "Sans limite",
  "uk": "Без обмежень"
 },
 "Restart required": {
  "tr": "Yeniden başlatma gerekli",
  "es": "Reinicio necesario",
  "pt": "Reinício necessário",
  "fr": "Redémarrage nécessaire",
  "uk": "Потрібен перезапуск"
 },
 "Restart Prism": {
  "tr": "Prism’i yeniden başlat",
  "es": "Reiniciar Prism",
  "pt": "Reiniciar Prism",
  "fr": "Redémarrer Prism",
  "uk": "Перезапустити Prism"
 },
 "Sleep idle tabs after": {
  "tr": "Boştaki sekmeleri uyutma süresi",
  "es": "Suspender pestañas inactivas tras",
  "pt": "Suspender separadores inativos após",
  "fr": "Mettre les onglets inactifs en veille après",
  "uk": "Призупиняти неактивні вкладки через"
 },
 "1 minute": {
  "tr": "1 dakika",
  "es": "1 minuto",
  "pt": "1 minuto",
  "fr": "1 minute",
  "uk": "1 хвилину"
 },
 "5 minutes": {
  "tr": "5 dakika",
  "es": "5 minutos",
  "pt": "5 minutos",
  "fr": "5 minutes",
  "uk": "5 хвилин"
 },
 "10 minutes": {
  "tr": "10 dakika",
  "es": "10 minutos",
  "pt": "10 minutos",
  "fr": "10 minutes",
  "uk": "10 хвилин"
 },
 "15 minutes": {
  "tr": "15 dakika",
  "es": "15 minutos",
  "pt": "15 minutos",
  "fr": "15 minutes",
  "uk": "15 хвилин"
 },
 "30 minutes": {
  "tr": "30 dakika",
  "es": "30 minutos",
  "pt": "30 minutos",
  "fr": "30 minutes",
  "uk": "30 хвилин"
 },
 "1 hour": {
  "tr": "1 saat",
  "es": "1 hora",
  "pt": "1 hora",
  "fr": "1 heure",
  "uk": "1 годину"
 },
 "Release background pages now": {
  "tr": "Arka plan sayfalarını şimdi serbest bırak",
  "es": "Liberar páginas en segundo plano",
  "pt": "Libertar páginas em segundo plano",
  "fr": "Libérer les pages en arrière-plan",
  "uk": "Звільнити фонові сторінки зараз"
 },
 "Sleep tabs": {
  "tr": "Sekmeleri uyut",
  "es": "Suspender pestañas",
  "pt": "Suspender separadores",
  "fr": "Mettre les onglets en veille",
  "uk": "Призупинити вкладки"
 },
 "Your extensions": {
  "tr": "Uzantıların",
  "es": "Tus extensiones",
  "pt": "As suas extensões",
  "fr": "Vos extensions",
  "uk": "Ваші розширення"
 },
 "Load unpacked…": {
  "tr": "Paketlenmemiş yükle…",
  "es": "Cargar descomprimida…",
  "pt": "Carregar descompactada…",
  "fr": "Charger une extension non empaquetée…",
  "uk": "Завантажити розпаковане…"
 },
 "Install from the Chrome Web Store or load a local extension.": {
  "tr": "Chrome Web Mağazası’ndan veya yerel dosyadan uzantı yükle.",
  "es": "Instala desde Chrome Web Store o carga una extensión local.",
  "pt": "Instale da Chrome Web Store ou carregue uma extensão local.",
  "fr": "Installez depuis le Chrome Web Store ou chargez une extension locale.",
  "uk": "Установіть із Chrome Web Store або завантажте локальне розширення."
 },
 "Open popup": {
  "tr": "Açılır pencereyi aç",
  "es": "Abrir ventana emergente",
  "pt": "Abrir janela pop-up",
  "fr": "Ouvrir la fenêtre contextuelle",
  "uk": "Відкрити спливне вікно"
 },
 "Options": {
  "tr": "Seçenekler",
  "es": "Opciones",
  "pt": "Opções",
  "fr": "Options",
  "uk": "Параметри"
 },
 "Remove": {
  "tr": "Kaldır",
  "es": "Eliminar",
  "pt": "Remover",
  "fr": "Supprimer",
  "uk": "Видалити"
 },
 "Manage extensions in Settings": {
  "tr": "Uzantıları Ayarlarda yönet",
  "es": "Gestionar extensiones en Ajustes",
  "pt": "Gerir extensões nas Definições",
  "fr": "Gérer les extensions dans les Réglages",
  "uk": "Керувати розширеннями в налаштуваннях"
 },
 "Download settings": {
  "tr": "İndirme ayarları",
  "es": "Ajustes de descarga",
  "pt": "Definições de transferências",
  "fr": "Réglages des téléchargements",
  "uk": "Налаштування завантажень"
 },
 "Clear finished": {
  "tr": "Tamamlananları temizle",
  "es": "Borrar finalizadas",
  "pt": "Limpar concluídas",
  "fr": "Effacer les téléchargements terminés",
  "uk": "Очистити завершені"
 },
 "Save files to": {
  "tr": "Dosyaları kaydetme yeri",
  "es": "Guardar archivos en",
  "pt": "Guardar ficheiros em",
  "fr": "Enregistrer les fichiers dans",
  "uk": "Зберігати файли в"
 },
 "Choose folder…": {
  "tr": "Klasör seç…",
  "es": "Elegir carpeta…",
  "pt": "Escolher pasta…",
  "fr": "Choisir un dossier…",
  "uk": "Вибрати теку…"
 },
 "Ask where to save each file": {
  "tr": "Her dosyanın nereye kaydedileceğini sor",
  "es": "Preguntar dónde guardar cada archivo",
  "pt": "Perguntar onde guardar cada ficheiro",
  "fr": "Demander où enregistrer chaque fichier",
  "uk": "Запитувати, де зберігати кожен файл"
 },
 "Open": {
  "tr": "Aç",
  "es": "Abrir",
  "pt": "Abrir",
  "fr": "Ouvrir",
  "uk": "Відкрити"
 },
 "Show in Finder": {
  "tr": "Finder’da göster",
  "es": "Mostrar en Finder",
  "pt": "Mostrar no Finder",
  "fr": "Afficher dans le Finder",
  "uk": "Показати у Finder"
 },
 "Resume": {
  "tr": "Sürdür",
  "es": "Reanudar",
  "pt": "Retomar",
  "fr": "Reprendre",
  "uk": "Продовжити"
 },
 "Cancel": {
  "tr": "İptal",
  "es": "Cancelar",
  "pt": "Cancelar",
  "fr": "Annuler",
  "uk": "Скасувати"
 },
 "Pause": {
  "tr": "Duraklat",
  "es": "Pausar",
  "pt": "Pausar",
  "fr": "Suspendre",
  "uk": "Призупинити"
 },
 "Retry": {
  "tr": "Yeniden dene",
  "es": "Reintentar",
  "pt": "Tentar novamente",
  "fr": "Réessayer",
  "uk": "Повторити"
 },
 "Save": {
  "tr": "Kaydet",
  "es": "Guardar",
  "pt": "Guardar",
  "fr": "Enregistrer",
  "uk": "Зберегти"
 },
 "Name": {
  "tr": "Ad",
  "es": "Nombre",
  "pt": "Nome",
  "fr": "Nom",
  "uk": "Назва"
 },
 "Address": {
  "tr": "Adres",
  "es": "Dirección",
  "pt": "Endereço",
  "fr": "Adresse",
  "uk": "Адреса"
 },
 "Folder": {
  "tr": "Klasör",
  "es": "Carpeta",
  "pt": "Pasta",
  "fr": "Dossier",
  "uk": "Тека"
 },
 "Pinned": {
  "tr": "Sabitlenmiş",
  "es": "Fijados",
  "pt": "Fixados",
  "fr": "Épinglés",
  "uk": "Закріплені"
 },
 "Show in Favorites": {
  "tr": "Favorilerde göster",
  "es": "Mostrar en favoritos",
  "pt": "Mostrar nos favoritos",
  "fr": "Afficher dans les favoris",
  "uk": "Показувати в обраному"
 },
 "New bookmark": {
  "tr": "Yeni yer imi",
  "es": "Nuevo marcador",
  "pt": "Novo marcador",
  "fr": "Nouveau favori",
  "uk": "Нова закладка"
 },
 "Passwords & sign-ins": {
  "tr": "Parolalar ve oturumlar",
  "es": "Contraseñas e inicios de sesión",
  "pt": "Palavras-passe e sessões",
  "fr": "Mots de passe et connexions",
  "uk": "Паролі та входи"
 },
 "Offer to save passwords": {
  "tr": "Parola kaydetmeyi öner",
  "es": "Ofrecer guardar contraseñas",
  "pt": "Oferecer guardar palavras-passe",
  "fr": "Proposer d’enregistrer les mots de passe",
  "uk": "Пропонувати зберігати паролі"
 },
 "Prism password vault": {
  "tr": "Prism parola kasası",
  "es": "Bóveda de contraseñas de Prism",
  "pt": "Cofre de palavras-passe do Prism",
  "fr": "Coffre de mots de passe Prism",
  "uk": "Сховище паролів Prism"
 },
 "Open Passwords": {
  "tr": "Parolalar’ı aç",
  "es": "Abrir Contraseñas",
  "pt": "Abrir Palavras-passe",
  "fr": "Ouvrir Mots de passe",
  "uk": "Відкрити Паролі"
 },
 "Import password CSV…": {
  "tr": "Parola CSV’sini içe aktar…",
  "es": "Importar CSV de contraseñas…",
  "pt": "Importar CSV de palavras-passe…",
  "fr": "Importer un CSV de mots de passe…",
  "uk": "Імпортувати CSV паролів…"
 },
 "Open welcome guide": {
  "tr": "Başlangıç kılavuzunu aç",
  "es": "Abrir guía de bienvenida",
  "pt": "Abrir guia de boas-vindas",
  "fr": "Ouvrir le guide de bienvenue",
  "uk": "Відкрити початковий посібник"
 },
 "Continue": {
  "tr": "Devam et",
  "es": "Continuar",
  "pt": "Continuar",
  "fr": "Continuer",
  "uk": "Продовжити"
 },
 "Skip": {
  "tr": "Atla",
  "es": "Omitir",
  "pt": "Ignorar",
  "fr": "Passer",
  "uk": "Пропустити"
 },
 "Done": {
  "tr": "Bitti",
  "es": "Listo",
  "pt": "Concluído",
  "fr": "Terminé",
  "uk": "Готово"
 },
 "Get started": {
  "tr": "Başla",
  "es": "Empezar",
  "pt": "Começar",
  "fr": "Commencer",
  "uk": "Почати"
 },
 "Make default": {
  "tr": "Varsayılan yap",
  "es": "Establecer como predeterminado",
  "pt": "Definir como predefinido",
  "fr": "Définir par défaut",
  "uk": "Зробити типовим"
 },
 "File": {
  "tr": "Dosya",
  "es": "Archivo",
  "pt": "Ficheiro",
  "fr": "Fichier",
  "uk": "Файл"
 },
 "Edit": {
  "tr": "Düzen",
  "es": "Editar",
  "pt": "Editar",
  "fr": "Édition",
  "uk": "Редагування"
 },
 "Bookmarks": {
  "tr": "Yer imleri",
  "es": "Marcadores",
  "pt": "Marcadores",
  "fr": "Favoris",
  "uk": "Закладки"
 },
 "View": {
  "tr": "Görünüm",
  "es": "Ver",
  "pt": "Ver",
  "fr": "Présentation",
  "uk": "Вигляд"
 },
 "Window": {
  "tr": "Pencere",
  "es": "Ventana",
  "pt": "Janela",
  "fr": "Fenêtre",
  "uk": "Вікно"
 },
 "Close tab": {
  "tr": "Sekmeyi kapat",
  "es": "Cerrar pestaña",
  "pt": "Fechar separador",
  "fr": "Fermer l’onglet",
  "uk": "Закрити вкладку"
 },
 "Reopen closed tab": {
  "tr": "Kapatılan sekmeyi yeniden aç",
  "es": "Reabrir pestaña cerrada",
  "pt": "Reabrir separador fechado",
  "fr": "Rouvrir l’onglet fermé",
  "uk": "Відкрити закриту вкладку"
 },
 "Import from Arc…": {
  "tr": "Arc’tan içe aktar…",
  "es": "Importar desde Arc…",
  "pt": "Importar do Arc…",
  "fr": "Importer depuis Arc…",
  "uk": "Імпортувати з Arc…"
 },
 "Find in page": {
  "tr": "Sayfada bul",
  "es": "Buscar en la página",
  "pt": "Localizar na página",
  "fr": "Rechercher dans la page",
  "uk": "Знайти на сторінці"
 },
 "Address bar": {
  "tr": "Adres çubuğu",
  "es": "Barra de direcciones",
  "pt": "Barra de endereços",
  "fr": "Barre d’adresse",
  "uk": "Адресний рядок"
 },
 "Reload page": {
  "tr": "Sayfayı yenile",
  "es": "Recargar página",
  "pt": "Recarregar página",
  "fr": "Actualiser la page",
  "uk": "Перезавантажити сторінку"
 },
 "Show downloads": {
  "tr": "İndirilenleri göster",
  "es": "Mostrar descargas",
  "pt": "Mostrar transferências",
  "fr": "Afficher les téléchargements",
  "uk": "Показати завантаження"
 },
 "Check for Updates…": {
  "tr": "Güncellemeleri Denetle…",
  "es": "Buscar actualizaciones…",
  "pt": "Procurar atualizações…",
  "fr": "Rechercher des mises à jour…",
  "uk": "Перевірити оновлення…"
 },
 "Prism updates": {
  "tr": "Prism güncellemeleri",
  "es": "Actualizaciones de Prism",
  "pt": "Atualizações do Prism",
  "fr": "Mises à jour de Prism",
  "uk": "Оновлення Prism"
 },
 "Beta releases for this Mac.": {
  "tr": "Bu Mac için beta sürümleri.",
  "es": "Versiones beta para este Mac.",
  "pt": "Versões beta para este Mac.",
  "fr": "Versions bêta pour ce Mac.",
  "uk": "Бета-версії для цього Mac."
 },
 "Installed version": {
  "tr": "Yüklü sürüm",
  "es": "Versión instalada",
  "pt": "Versão instalada",
  "fr": "Version installée",
  "uk": "Установлена версія"
 },
 "Automatic updates": {
  "tr": "Otomatik güncellemeler",
  "es": "Actualizaciones automáticas",
  "pt": "Atualizações automáticas",
  "fr": "Mises à jour automatiques",
  "uk": "Автоматичні оновлення"
 },
 "Check in the background. Restart when you are ready.": {
  "tr": "Arka planda denetle. Hazır olduğunda yeniden başlat.",
  "es": "Buscar en segundo plano. Reinicia cuando quieras.",
  "pt": "Procurar em segundo plano. Reinicie quando quiser.",
  "fr": "Vérifier en arrière-plan. Redémarrez quand vous le souhaitez.",
  "uk": "Перевіряти у фоні. Перезапустіть, коли будете готові."
 },
 "Update publishing is not configured yet. This beta uses manual installation.": {
  "tr": "Güncelleme yayını henüz yapılandırılmadı. Bu beta elle yüklenir.",
  "es": "La publicación de actualizaciones aún no está configurada. Esta beta se instala manualmente.",
  "pt": "A publicação de atualizações ainda não está configurada. Esta beta é instalada manualmente.",
  "fr": "La publication des mises à jour n’est pas encore configurée. Cette bêta s’installe manuellement.",
  "uk": "Публікацію оновлень ще не налаштовано. Цю бета-версію потрібно встановити вручну."
 },
 "Ready to check for updates.": {
  "tr": "Güncellemeleri denetlemeye hazır.",
  "es": "Listo para buscar actualizaciones.",
  "pt": "Pronto para procurar atualizações.",
  "fr": "Prêt à rechercher des mises à jour.",
  "uk": "Готово до перевірки оновлень."
 },
 "Checking for updates…": {
  "tr": "Güncellemeler denetleniyor…",
  "es": "Buscando actualizaciones…",
  "pt": "A procurar atualizações…",
  "fr": "Recherche de mises à jour…",
  "uk": "Перевірка оновлень…"
 },
 "Downloading an update…": {
  "tr": "Güncelleme indiriliyor…",
  "es": "Descargando actualización…",
  "pt": "A transferir atualização…",
  "fr": "Téléchargement d’une mise à jour…",
  "uk": "Завантаження оновлення…"
 },
 "Prism is up to date.": {
  "tr": "Prism güncel.",
  "es": "Prism está actualizado.",
  "pt": "O Prism está atualizado.",
  "fr": "Prism est à jour.",
  "uk": "Prism оновлено."
 },
 "An update is ready. Restart to install it.": {
  "tr": "Güncelleme hazır. Yüklemek için yeniden başlat.",
  "es": "Actualización lista. Reinicia para instalarla.",
  "pt": "Atualização pronta. Reinicie para instalar.",
  "fr": "Une mise à jour est prête. Redémarrez pour l’installer.",
  "uk": "Оновлення готове. Перезапустіть для встановлення."
 },
 "Could not check for updates. Try again later.": {
  "tr": "Güncellemeler denetlenemedi. Daha sonra tekrar dene.",
  "es": "No se pudieron buscar actualizaciones. Inténtalo más tarde.",
  "pt": "Não foi possível procurar atualizações. Tente mais tarde.",
  "fr": "Impossible de rechercher les mises à jour. Réessayez plus tard.",
  "uk": "Не вдалося перевірити оновлення. Спробуйте пізніше."
 },
 "Restart and install": {
  "tr": "Yeniden başlat ve yükle",
  "es": "Reiniciar e instalar",
  "pt": "Reiniciar e instalar",
  "fr": "Redémarrer et installer",
  "uk": "Перезапустити та встановити"
 },
 "Design studio": {
  "tr": "Tasarım stüdyosu",
  "es": "Estudio de diseño",
  "pt": "Estúdio de design",
  "fr": "Studio de design",
  "uk": "Студія дизайну"
 },
 "Ads & trackers": {
  "tr": "Reklamlar ve izleyiciler",
  "es": "Anuncios y rastreadores",
  "pt": "Anúncios e rastreadores",
  "fr": "Publicités et traqueurs",
  "uk": "Реклама й відстеження"
 },
 "Save a page with ⌘D, or drag a bookmark here.": {
  "tr": "⌘D ile bir sayfa kaydet veya buraya yer imi sürükle.",
  "es": "Guarda una página con ⌘D o arrastra aquí un marcador.",
  "pt": "Guarde uma página com ⌘D ou arraste um marcador para aqui.",
  "fr": "Enregistrez une page avec ⌘D ou glissez un favori ici.",
  "uk": "Збережіть сторінку за допомогою ⌘D або перетягніть сюди закладку."
 },
 "Previews are captured locally after visiting a saved page.": {
  "tr": "Kayıtlı sayfa ziyaret edilince önizleme bu Mac’te oluşturulur.",
  "es": "Las vistas previas se guardan localmente al visitar una página guardada.",
  "pt": "As pré-visualizações são guardadas localmente após visitar uma página guardada.",
  "fr": "Les aperçus sont enregistrés localement après la visite d’une page enregistrée.",
  "uk": "Попередні перегляди створюються локально після відвідування збереженої сторінки."
 },
 "My custom colors": {
  "tr": "Özel renklerim",
  "es": "Mis colores personalizados",
  "pt": "As minhas cores personalizadas",
  "fr": "Mes couleurs personnalisées",
  "uk": "Мої власні кольори"
 },
 "Fine-tune your palette": {
  "tr": "Paletini ince ayarla",
  "es": "Ajusta tu paleta",
  "pt": "Ajuste a sua paleta",
  "fr": "Affinez votre palette",
  "uk": "Налаштуйте палітру"
 },
 "Color mode": {
  "tr": "Renk modu",
  "es": "Modo de color",
  "pt": "Modo de cor",
  "fr": "Mode de couleur",
  "uk": "Колірний режим"
 },
 "Import theme…": {
  "tr": "Temayı içe aktar…",
  "es": "Importar tema…",
  "pt": "Importar tema…",
  "fr": "Importer un thème…",
  "uk": "Імпортувати тему…"
 },
 "Export theme…": {
  "tr": "Temayı dışa aktar…",
  "es": "Exportar tema…",
  "pt": "Exportar tema…",
  "fr": "Exporter le thème…",
  "uk": "Експортувати тему…"
 },
 "Reset theme": {
  "tr": "Temayı sıfırla",
  "es": "Restablecer tema",
  "pt": "Repor tema",
  "fr": "Réinitialiser le thème",
  "uk": "Скинути тему"
 },
 "Find your atmosphere. Make it yours.": {
  "tr": "Sana uygun ortamı bul. Kendine göre düzenle.",
  "es": "Encuentra tu ambiente. Hazlo tuyo.",
  "pt": "Encontre o seu ambiente. Personalize-o.",
  "fr": "Trouvez votre ambiance. Personnalisez-la.",
  "uk": "Знайдіть свою атмосферу. Зробіть її власною."
 },
 "Use Appearance for glass, spacing and sidebar width. Accessibility overrides take priority.": {
  "tr": "Cam, boşluk ve kenar çubuğu için Görünüm’ü kullan. Erişilebilirlik tercihleri önceliklidir.",
  "es": "Usa Apariencia para cristal, espaciado y barra lateral. La accesibilidad tiene prioridad.",
  "pt": "Use Aparência para vidro, espaçamento e barra lateral. A acessibilidade tem prioridade.",
  "fr": "Utilisez Apparence pour le verre, l’espacement et la barre latérale. L’accessibilité est prioritaire.",
  "uk": "Використовуйте Вигляд для скла, відступів і бічної панелі. Доступність має пріоритет."
 },
 "Saved logins": {
  "tr": "Kayıtlı girişler",
  "es": "Inicios de sesión guardados",
  "pt": "Credenciais guardadas",
  "fr": "Identifiants enregistrés",
  "uk": "Збережені облікові дані"
 },
 "Choose a login": {
  "tr": "Giriş seç",
  "es": "Elige una cuenta",
  "pt": "Escolha uma conta",
  "fr": "Choisissez un identifiant",
  "uk": "Виберіть обліковий запис"
 },
 "Search websites or accounts": {
  "tr": "Site veya hesap ara",
  "es": "Buscar sitios o cuentas",
  "pt": "Pesquisar sites ou contas",
  "fr": "Rechercher des sites ou comptes",
  "uk": "Пошук сайтів або облікових записів"
 },
 "Search saved logins": {
  "tr": "Kayıtlı girişlerde ara",
  "es": "Buscar cuentas guardadas",
  "pt": "Pesquisar contas guardadas",
  "fr": "Rechercher des identifiants enregistrés",
  "uk": "Пошук збережених облікових даних"
 },
 "Search accounts": {
  "tr": "Hesaplarda ara",
  "es": "Buscar cuentas",
  "pt": "Pesquisar contas",
  "fr": "Rechercher des comptes",
  "uk": "Пошук облікових записів"
 },
 "Delete": {
  "tr": "Sil",
  "es": "Eliminar",
  "pt": "Eliminar",
  "fr": "Supprimer",
  "uk": "Видалити"
 },
 "Search history": {
  "tr": "Geçmişte ara",
  "es": "Buscar en el historial",
  "pt": "Pesquisar no histórico",
  "fr": "Rechercher dans l’historique",
  "uk": "Пошук в історії"
 },
 "Clear history": {
  "tr": "Geçmişi temizle",
  "es": "Borrar historial",
  "pt": "Limpar histórico",
  "fr": "Effacer l’historique",
  "uk": "Очистити історію"
 },
 "No history yet.": {
  "tr": "Henüz geçmiş yok.",
  "es": "Aún no hay historial.",
  "pt": "Ainda não há histórico.",
  "fr": "Aucun historique pour le moment.",
  "uk": "Історія поки порожня."
 },
 "No saved site permissions.": {
  "tr": "Kayıtlı site izni yok.",
  "es": "No hay permisos guardados.",
  "pt": "Não há permissões guardadas.",
  "fr": "Aucune autorisation enregistrée.",
  "uk": "Немає збережених дозволів сайтів."
 },
 "Reset": {
  "tr": "Sıfırla",
  "es": "Restablecer",
  "pt": "Repor",
  "fr": "Réinitialiser",
  "uk": "Скинути"
 },
 "Previous match": {
  "tr": "Önceki eşleşme",
  "es": "Coincidencia anterior",
  "pt": "Resultado anterior",
  "fr": "Résultat précédent",
  "uk": "Попередній збіг"
 },
 "Next match": {
  "tr": "Sonraki eşleşme",
  "es": "Siguiente coincidencia",
  "pt": "Resultado seguinte",
  "fr": "Résultat suivant",
  "uk": "Наступний збіг"
 },
 "Close find": {
  "tr": "Aramayı kapat",
  "es": "Cerrar búsqueda",
  "pt": "Fechar pesquisa",
  "fr": "Fermer la recherche",
  "uk": "Закрити пошук"
 },
 "No matches": {
  "tr": "Eşleşme yok",
  "es": "Sin coincidencias",
  "pt": "Sem resultados",
  "fr": "Aucun résultat",
  "uk": "Немає збігів"
 },
 "Set up later": {
  "tr": "Sonra ayarla",
  "es": "Configurar más tarde",
  "pt": "Configurar mais tarde",
  "fr": "Configurer plus tard",
  "uk": "Налаштувати пізніше"
 },
 "Let’s begin": {
  "tr": "Başlayalım",
  "es": "Empecemos",
  "pt": "Vamos começar",
  "fr": "Commençons",
  "uk": "Почнімо"
 },
 "Start browsing": {
  "tr": "Gezinmeye başla",
  "es": "Empezar a navegar",
  "pt": "Começar a navegar",
  "fr": "Commencer à naviguer",
  "uk": "Почати перегляд"
 },
 "A little more room for you.": {
  "tr": "Sana biraz daha alan.",
  "es": "Un poco más de espacio para ti.",
  "pt": "Um pouco mais de espaço para si.",
  "fr": "Un peu plus d’espace pour vous.",
  "uk": "Трохи більше простору для вас."
 },
 "Your browser, your colors, your familiar places.": {
  "tr": "Tarayıcın, renklerin, bildiğin yerler.",
  "es": "Tu navegador, tus colores, tus lugares habituales.",
  "pt": "O seu navegador, as suas cores, os seus lugares.",
  "fr": "Votre navigateur, vos couleurs, vos lieux familiers.",
  "uk": "Ваш браузер, ваші кольори, ваші знайомі місця."
 },
 "Make Prism yours in a few small steps. Every step is optional, and you can come back anytime.": {
  "tr": "Prism’i birkaç adımda kendine göre ayarla. Tüm adımlar isteğe bağlı; istediğinde geri dönebilirsin.",
  "es": "Personaliza Prism en pocos pasos. Todos son opcionales y puedes volver cuando quieras.",
  "pt": "Personalize o Prism em poucos passos. Todos são opcionais e pode voltar quando quiser.",
  "fr": "Personnalisez Prism en quelques étapes. Toutes sont facultatives et vous pouvez revenir quand vous voulez.",
  "uk": "Налаштуйте Prism за кілька кроків. Усі кроки необов’язкові, і ви можете повернутися будь-коли."
 },
 "Find your atmosphere.": {
  "tr": "Sana uygun ortamı bul.",
  "es": "Encuentra tu ambiente.",
  "pt": "Encontre o seu ambiente.",
  "fr": "Trouvez votre ambiance.",
  "uk": "Знайдіть свою атмосферу."
 },
 "Choose a starting palette. Your custom colors remain available.": {
  "tr": "Bir başlangıç paleti seç. Özel renklerin kullanılabilir kalır.",
  "es": "Elige una paleta inicial. Tus colores personalizados siguen disponibles.",
  "pt": "Escolha uma paleta inicial. As suas cores personalizadas continuam disponíveis.",
  "fr": "Choisissez une palette initiale. Vos couleurs personnalisées restent disponibles.",
  "uk": "Виберіть початкову палітру. Ваші власні кольори залишаться доступними."
 },
 "Bring your favorite places.": {
  "tr": "Sevdiğin yerleri getir.",
  "es": "Trae tus lugares favoritos.",
  "pt": "Traga os seus lugares favoritos.",
  "fr": "Retrouvez vos lieux favoris.",
  "uk": "Перенесіть улюблені місця."
 },
 "Your bookmarks and folders can feel right at home.": {
  "tr": "Yer imlerin ve klasörlerin burada da yanında.",
  "es": "Tus marcadores y carpetas se sentirán como en casa.",
  "pt": "Os seus marcadores e pastas sentir-se-ão em casa.",
  "fr": "Vos favoris et dossiers retrouveront leur place.",
  "uk": "Ваші закладки й теки будуть як удома."
 },
 "Import pinned tabs, favorites and folders": {
  "tr": "Sabit sekmeleri, favorileri ve klasörleri içe aktar",
  "es": "Importar pestañas fijadas, favoritos y carpetas",
  "pt": "Importar separadores fixados, favoritos e pastas",
  "fr": "Importer les onglets épinglés, favoris et dossiers",
  "uk": "Імпортувати закріплені вкладки, обране й теки"
 },
 "Choose a local profile and import its bookmarks": {
  "tr": "Yerel profil seç ve yer imlerini içe aktar",
  "es": "Elige un perfil local e importa sus marcadores",
  "pt": "Escolha um perfil local e importe os marcadores",
  "fr": "Choisissez un profil local et importez ses favoris",
  "uk": "Виберіть локальний профіль та імпортуйте закладки"
 },
 "Safari & other browsers": {
  "tr": "Safari ve diğer tarayıcılar",
  "es": "Safari y otros navegadores",
  "pt": "Safari e outros navegadores",
  "fr": "Safari et autres navigateurs",
  "uk": "Safari та інші браузери"
 },
 "Choose a bookmarks HTML export or Chrome Bookmarks JSON": {
  "tr": "Yer imleri HTML dosyası veya Chrome Bookmarks JSON seç",
  "es": "Elige un archivo HTML de marcadores o JSON de Chrome",
  "pt": "Escolha um HTML de marcadores ou JSON do Chrome",
  "fr": "Choisissez un fichier HTML de favoris ou JSON de Chrome",
  "uk": "Виберіть HTML закладок або JSON закладок Chrome"
 },
 "Keep your logins close.": {
  "tr": "Giriş bilgilerin yanında olsun.",
  "es": "Ten tus cuentas a mano.",
  "pt": "Tenha as suas contas à mão.",
  "fr": "Gardez vos identifiants à portée de main.",
  "uk": "Тримайте облікові дані поруч."
 },
 "Import a password export into Prism’s encrypted vault.": {
  "tr": "Parola dışa aktarımını Prism’in şifreli kasasına aktar.",
  "es": "Importa contraseñas a la bóveda cifrada de Prism.",
  "pt": "Importe palavras-passe para o cofre encriptado do Prism.",
  "fr": "Importez vos mots de passe dans le coffre chiffré de Prism.",
  "uk": "Імпортуйте паролі до зашифрованого сховища Prism."
 },
 "From Apple Passwords": {
  "tr": "Apple Parolalar’dan",
  "es": "Desde Contraseñas de Apple",
  "pt": "Das Palavras-passe da Apple",
  "fr": "Depuis Mots de passe d’Apple",
  "uk": "З Паролів Apple"
 },
 "Open Passwords and unlock it.": {
  "tr": "Parolalar’ı aç ve kilidini kaldır.",
  "es": "Abre Contraseñas y desbloquéala.",
  "pt": "Abra Palavras-passe e desbloqueie-a.",
  "fr": "Ouvrez Mots de passe et déverrouillez l’app.",
  "uk": "Відкрийте Паролі та розблокуйте їх."
 },
 "Use File → Export All Passwords to File, or export selected passwords.": {
  "tr": "Dosya → Tüm Parolaları Dosyaya Aktar’ı kullan veya seçili parolaları aktar.",
  "es": "Usa Archivo → Exportar todas las contraseñas o exporta las seleccionadas.",
  "pt": "Use Ficheiro → Exportar todas as palavras-passe ou exporte as selecionadas.",
  "fr": "Utilisez Fichier → Exporter tous les mots de passe ou exportez ceux sélectionnés.",
  "uk": "Скористайтеся Файл → Експортувати всі паролі або експортуйте вибрані паролі."
 },
 "Choose the CSV below and review the import.": {
  "tr": "Aşağıdan CSV’yi seç ve içe aktarımı incele.",
  "es": "Elige el CSV y revisa la importación.",
  "pt": "Escolha o CSV e reveja a importação.",
  "fr": "Choisissez le CSV ci-dessous et vérifiez l’importation.",
  "uk": "Виберіть CSV нижче та перевірте імпорт."
 },
 "Open Apple Passwords": {
  "tr": "Apple Parolalar’ı aç",
  "es": "Abrir Contraseñas de Apple",
  "pt": "Abrir Palavras-passe da Apple",
  "fr": "Ouvrir Mots de passe d’Apple",
  "uk": "Відкрити Паролі Apple"
 },
 "Choose password CSV…": {
  "tr": "Parola CSV’si seç…",
  "es": "Elegir CSV de contraseñas…",
  "pt": "Escolher CSV de palavras-passe…",
  "fr": "Choisir un CSV de mots de passe…",
  "uk": "Вибрати CSV паролів…"
 },
 "Password import progress": {
  "tr": "Parola içe aktarma ilerlemesi",
  "es": "Progreso de importación de contraseñas",
  "pt": "Progresso da importação de palavras-passe",
  "fr": "Progression de l’importation des mots de passe",
  "uk": "Перебіг імпорту паролів"
 },
 "Ready when you are.": {
  "tr": "Hazır olduğunda başlayabiliriz.",
  "es": "Cuando quieras.",
  "pt": "Quando quiser.",
  "fr": "Quand vous voulez.",
  "uk": "Коли будете готові."
 },
 "Make Prism your everyday browser.": {
  "tr": "Prism günlük tarayıcın olsun.",
  "es": "Haz de Prism tu navegador habitual.",
  "pt": "Torne o Prism o seu navegador habitual.",
  "fr": "Faites de Prism votre navigateur quotidien.",
  "uk": "Зробіть Prism своїм щоденним браузером."
 },
 "Open links from other apps here.": {
  "tr": "Diğer uygulamalardaki bağlantıları burada aç.",
  "es": "Abre aquí enlaces de otras apps.",
  "pt": "Abra aqui ligações de outras apps.",
  "fr": "Ouvrez ici les liens des autres apps.",
  "uk": "Відкривайте тут посилання з інших програм."
 },
 "Your links, in Prism": {
  "tr": "Bağlantıların Prism’de",
  "es": "Tus enlaces en Prism",
  "pt": "As suas ligações no Prism",
  "fr": "Vos liens dans Prism",
  "uk": "Ваші посилання в Prism"
 },
 "Choose Prism as your default for web links. macOS may ask you to confirm.": {
  "tr": "Web bağlantıları için Prism’i varsayılan seç. macOS onay isteyebilir.",
  "es": "Elige Prism para abrir enlaces web. macOS puede pedir confirmación.",
  "pt": "Escolha o Prism para abrir ligações web. O macOS pode pedir confirmação.",
  "fr": "Choisissez Prism pour les liens Web. macOS peut demander confirmation.",
  "uk": "Виберіть Prism типовим для вебпосилань. macOS може попросити підтвердження."
 },
 "Make Prism default": {
  "tr": "Prism’i varsayılan yap",
  "es": "Establecer Prism como predeterminado",
  "pt": "Definir Prism como predefinido",
  "fr": "Définir Prism par défaut",
  "uk": "Зробити Prism типовим"
 },
 "Open System Settings": {
  "tr": "Sistem Ayarları’nı aç",
  "es": "Abrir Ajustes del Sistema",
  "pt": "Abrir Definições do Sistema",
  "fr": "Ouvrir Réglages Système",
  "uk": "Відкрити Системні параметри"
 },
 "Prism is your default browser.": {
  "tr": "Prism varsayılan tarayıcın.",
  "es": "Prism es tu navegador predeterminado.",
  "pt": "O Prism é o seu navegador predefinido.",
  "fr": "Prism est votre navigateur par défaut.",
  "uk": "Prism — ваш типовий браузер."
 },
 "Install Prism in Applications to enable this.": {
  "tr": "Bunu etkinleştirmek için Prism’i Uygulamalar’a yükle.",
  "es": "Instala Prism en Aplicaciones para activar esta opción.",
  "pt": "Instale o Prism em Aplicações para ativar esta opção.",
  "fr": "Installez Prism dans Applications pour activer cette option.",
  "uk": "Установіть Prism у Програми, щоб увімкнути це."
 },
 "You’re ready to explore.": {
  "tr": "Keşfetmeye hazırsın.",
  "es": "Todo listo para explorar.",
  "pt": "Tudo pronto para explorar.",
  "fr": "Vous êtes prêt à explorer.",
  "uk": "Ви готові до відкриттів."
 },
 "A few little shortcuts go a long way.": {
  "tr": "Birkaç kısayol çok işe yarar.",
  "es": "Unos atajos te ayudarán mucho.",
  "pt": "Alguns atalhos fazem a diferença.",
  "fr": "Quelques raccourcis font la différence.",
  "uk": "Кілька комбінацій клавіш стануть у пригоді."
 },
 "Jump to the address bar. Use ↑ ↓ and Enter to choose a suggestion.": {
  "tr": "Adres çubuğuna git. Öneri seçmek için ↑ ↓ ve Enter kullan.",
  "es": "Ve a la barra de direcciones. Usa ↑ ↓ y Enter para elegir una sugerencia.",
  "pt": "Vá à barra de endereços. Use ↑ ↓ e Enter para escolher uma sugestão.",
  "fr": "Allez à la barre d’adresse. Utilisez ↑ ↓ et Entrée pour choisir une suggestion.",
  "uk": "Перейдіть до адресного рядка. Використовуйте ↑ ↓ та Enter для вибору підказки."
 },
 "Open a new tab. Favorites and pinned labels keep their own pages.": {
  "tr": "Yeni sekme aç. Favoriler ve sabit etiketler kendi sayfalarını korur.",
  "es": "Abre una pestaña. Favoritos y etiquetas fijadas conservan sus páginas.",
  "pt": "Abra um separador. Favoritos e etiquetas fixadas mantêm as suas páginas.",
  "fr": "Ouvrez un onglet. Les favoris et éléments épinglés conservent leurs pages.",
  "uk": "Відкрийте вкладку. Обране й закріплені елементи зберігають свої сторінки."
 },
 "Save a page. Drag bookmarks into folders to organize them.": {
  "tr": "Sayfa kaydet. Yer imlerini klasörlere sürükleyerek düzenle.",
  "es": "Guarda una página. Arrastra marcadores a carpetas para organizarlos.",
  "pt": "Guarde uma página. Arraste marcadores para pastas para os organizar.",
  "fr": "Enregistrez une page. Glissez les favoris dans des dossiers pour les organiser.",
  "uk": "Збережіть сторінку. Перетягуйте закладки до тек для впорядкування."
 },
 "Drag the sidebar edge to resize it. Double-click to reset.": {
  "tr": "Boyutlandırmak için kenar çubuğunun kenarını sürükle. Sıfırlamak için çift tıkla.",
  "es": "Arrastra el borde lateral para cambiar el tamaño. Doble clic para restablecer.",
  "pt": "Arraste a margem lateral para redimensionar. Duplo clique para repor.",
  "fr": "Glissez le bord de la barre latérale pour la redimensionner. Double-cliquez pour réinitialiser.",
  "uk": "Перетягніть край бічної панелі для зміни розміру. Подвійне клацання скидає розмір."
 },
 "Idle tabs sleep to save RAM. Choose a sleeping tab to wake it.": {
  "tr": "Boş sekmeler RAM tasarrufu için uyur. Uyandırmak için sekmeyi seç.",
  "es": "Las pestañas inactivas se suspenden para ahorrar RAM. Selecciona una para activarla.",
  "pt": "Os separadores inativos são suspensos para poupar RAM. Selecione um para o ativar.",
  "fr": "Les onglets inactifs se mettent en veille pour économiser la RAM. Sélectionnez-en un pour le réveiller.",
  "uk": "Неактивні вкладки призупиняються для економії RAM. Виберіть вкладку, щоб активувати її."
 },
 "Export bookmarks from your browser first. If Safari exports a ZIP, unzip it and select its bookmarks HTML file. These imports don’t transfer extensions, cookies or active sign-ins.": {
  "tr": "Önce tarayıcından yer imlerini dışa aktar. Safari ZIP verirse açıp yer imleri HTML dosyasını seç. Uzantılar, çerezler ve açık oturumlar aktarılmaz.",
  "es": "Primero exporta los marcadores. Si Safari exporta un ZIP, descomprímelo y elige el HTML. No se transfieren extensiones, cookies ni sesiones activas.",
  "pt": "Exporte primeiro os marcadores. Se o Safari exportar um ZIP, extraia-o e escolha o HTML. Extensões, cookies e sessões ativas não são transferidos.",
  "fr": "Exportez d’abord vos favoris. Si Safari crée un ZIP, décompressez-le et choisissez le fichier HTML. Les extensions, cookies et sessions actives ne sont pas transférés.",
  "uk": "Спочатку експортуйте закладки. Якщо Safari створює ZIP, розпакуйте його та виберіть HTML закладок. Розширення, файли cookie й активні сеанси не переносяться."
 },
 "Arc, Chrome and other password managers: export passwords as CSV, then use the same import button.": {
  "tr": "Arc, Chrome ve diğer parola yöneticileri: Parolaları CSV olarak dışa aktar, ardından aynı içe aktarma düğmesini kullan.",
  "es": "Arc, Chrome y otros gestores: exporta las contraseñas como CSV y usa el mismo botón de importación.",
  "pt": "Arc, Chrome e outros gestores: exporte as palavras-passe como CSV e use o mesmo botão de importação.",
  "fr": "Arc, Chrome et autres gestionnaires : exportez les mots de passe en CSV et utilisez le même bouton d’importation.",
  "uk": "Arc, Chrome та інші менеджери: експортуйте паролі у CSV та скористайтеся тією самою кнопкою імпорту."
 },
 "One-time import, not iCloud sync. Passkeys and Sign in with Apple aren’t imported. CSV exports contain readable passwords; remove the export when you no longer need it. Undo is in Settings → Imports.": {
  "tr": "Bu, iCloud eşzamanlaması değil tek seferlik aktarımdır. Geçiş anahtarları ve Apple ile Giriş aktarılmaz. CSV dosyaları okunabilir parolalar içerir; işin bitince sil. Geri alma: Ayarlar → İçe aktarma.",
  "es": "Es una importación única, sin sincronización de iCloud. No incluye passkeys ni Iniciar sesión con Apple. El CSV contiene contraseñas legibles; elimínalo cuando termines. Deshacer está en Ajustes → Importaciones.",
  "pt": "É uma importação única, sem sincronização iCloud. Não inclui chaves de acesso nem Iniciar sessão com Apple. O CSV contém palavras-passe legíveis; elimine-o quando terminar. Anular está em Definições → Importações.",
  "fr": "Importation unique, sans synchronisation iCloud. Les clés d’accès et Connexion avec Apple ne sont pas importées. Le CSV contient des mots de passe lisibles ; supprimez-le après usage. Annuler se trouve dans Réglages → Importations.",
  "uk": "Це одноразовий імпорт без синхронізації iCloud. Ключі доступу та Вхід з Apple не імпортуються. CSV містить незашифровані паролі; видаліть його після використання. Скасування доступне в Налаштування → Імпорт."
 },
 "You can skip this. To change it later, open System Settings → Desktop & Dock → Default web browser, and choose Prism. Install Prism in Applications first if it isn’t listed.": {
  "tr": "Bu adımı atlayabilirsin. Daha sonra Sistem Ayarları → Masaüstü ve Dock → Varsayılan web tarayıcısı bölümünden Prism’i seç. Listede yoksa önce Uygulamalar’a yükle.",
  "es": "Puedes omitirlo. Más tarde, abre Ajustes del Sistema → Escritorio y Dock → Navegador web predeterminado y elige Prism. Si no aparece, instálalo en Aplicaciones.",
  "pt": "Pode ignorar este passo. Depois, abra Definições do Sistema → Secretária e Dock → Navegador predefinido e escolha Prism. Se não aparecer, instale-o em Aplicações.",
  "fr": "Vous pouvez passer cette étape. Plus tard, ouvrez Réglages Système → Bureau et Dock → Navigateur Web par défaut et choisissez Prism. Installez-le dans Applications s’il n’apparaît pas.",
  "uk": "Цей крок можна пропустити. Пізніше відкрийте Системні параметри → Робочий стіл і Dock → Типовий веббраузер та виберіть Prism. Якщо його немає, установіть у Програми."
 },
 "A little extra capability": {
  "tr": "Biraz daha işlev",
  "es": "Un poco más de funcionalidad",
  "pt": "Um pouco mais de funcionalidade",
  "fr": "Un peu plus de possibilités",
  "uk": "Трохи більше можливостей"
 },
 "Browse the Chrome Web Store to add an extension.": {
  "tr": "Uzantı eklemek için Chrome Web Mağazası’nı aç.",
  "es": "Visita Chrome Web Store para añadir una extensión.",
  "pt": "Visite a Chrome Web Store para adicionar uma extensão.",
  "fr": "Visitez le Chrome Web Store pour ajouter une extension.",
  "uk": "Відвідайте Chrome Web Store, щоб додати розширення."
 },
 "Files you’re bringing into your workspace.": {
  "tr": "Çalışma alanına getirdiğin dosyalar.",
  "es": "Archivos que traes a tu espacio de trabajo.",
  "pt": "Ficheiros que traz para o seu espaço de trabalho.",
  "fr": "Les fichiers que vous ajoutez à votre espace de travail.",
  "uk": "Файли, які ви додаєте до робочого простору."
 },
 "Your macOS Downloads folder": {
  "tr": "macOS İndirilenler klasörün",
  "es": "Tu carpeta Descargas de macOS",
  "pt": "A pasta Transferências do macOS",
  "fr": "Votre dossier Téléchargements de macOS",
  "uk": "Тека Завантаження macOS"
 },
 "Save logins on this Mac and fill them from the key button.": {
  "tr": "Giriş bilgilerini bu Mac’e kaydet ve anahtar düğmesiyle doldur.",
  "es": "Guarda credenciales en este Mac y rellénalas con el botón de llave.",
  "pt": "Guarde credenciais neste Mac e preencha-as com o botão de chave.",
  "fr": "Enregistrez vos identifiants sur ce Mac et remplissez-les avec le bouton clé.",
  "uk": "Зберігайте облікові дані на цьому Mac і заповнюйте їх кнопкою ключа."
 },
 "Ask after submitting a sign-in form on an HTTPS website.": {
  "tr": "HTTPS sitesinde giriş formu gönderildikten sonra sor.",
  "es": "Preguntar tras enviar un formulario de inicio de sesión HTTPS.",
  "pt": "Perguntar após enviar um formulário de sessão HTTPS.",
  "fr": "Demander après l’envoi d’un formulaire de connexion HTTPS.",
  "uk": "Запитувати після надсилання форми входу на HTTPS-сайті."
 },
 "Encrypted using macOS Keychain.": {
  "tr": "macOS Anahtar Zinciri ile şifreli.",
  "es": "Cifrado con el Llavero de macOS.",
  "pt": "Encriptado com o Porta-chaves do macOS.",
  "fr": "Chiffré avec le Trousseau macOS.",
  "uk": "Зашифровано за допомогою В’язки ключів macOS."
 },
 "Save current login…": {
  "tr": "Geçerli girişi kaydet…",
  "es": "Guardar credenciales actuales…",
  "pt": "Guardar credenciais atuais…",
  "fr": "Enregistrer l’identifiant actuel…",
  "uk": "Зберегти поточні облікові дані…"
 },
 "Exported CSV files contain readable passwords. Delete the export when you no longer need it.": {
  "tr": "CSV dosyaları okunabilir parolalar içerir. İşin bitince dışa aktarılan dosyayı sil.",
  "es": "Los CSV contienen contraseñas legibles. Elimina el archivo cuando ya no lo necesites.",
  "pt": "Os CSV contêm palavras-passe legíveis. Elimine o ficheiro quando já não precisar dele.",
  "fr": "Les CSV contiennent des mots de passe lisibles. Supprimez le fichier après usage.",
  "uk": "CSV містять незашифровані паролі. Видаліть файл, коли він більше не потрібен."
 },
 "Playing media, edited forms, and protected tabs stay awake.": {
  "tr": "Medya oynatan, düzenlenmiş form içeren ve korunan sekmeler uyanık kalır.",
  "es": "Las pestañas con multimedia, formularios editados o protección siguen activas.",
  "pt": "Separadores com multimédia, formulários editados ou proteção continuam ativos.",
  "fr": "Les onglets avec média, formulaire modifié ou protection restent actifs.",
  "uk": "Вкладки з медіа, зміненими формами й захистом залишаються активними."
 },
 "Older idle tabs sleep above this soft limit. Active pages, media and unsaved forms stay awake.": {
  "tr": "Bu esnek sınırın üstünde eski boş sekmeler uyur. Etkin sayfalar, medya ve kaydedilmemiş formlar uyanık kalır.",
  "es": "Las pestañas inactivas antiguas se suspenden sobre este límite flexible. Páginas activas, multimedia y formularios sin guardar siguen activos.",
  "pt": "Os separadores inativos antigos são suspensos acima deste limite flexível. Páginas ativas, multimédia e formulários por guardar continuam ativos.",
  "fr": "Les anciens onglets inactifs se mettent en veille au-delà de cette limite souple. Pages actives, médias et formulaires non enregistrés restent actifs.",
  "uk": "Старі неактивні вкладки призупиняються понад цей гнучкий ліміт. Активні сторінки, медіа та незбережені форми залишаються активними."
 },
 "Open tab addresses are restored; unsaved input is not.": {
  "tr": "Açık sekmelerin adresleri geri yüklenir; kaydedilmemiş girdiler yüklenmez.",
  "es": "Se restauran las direcciones, pero no los datos sin guardar.",
  "pt": "Os endereços são restaurados, mas os dados por guardar não.",
  "fr": "Les adresses sont restaurées, mais pas les saisies non enregistrées.",
  "uk": "Адреси вкладок відновлюються, але незбережені дані — ні."
 },
 "A quieter web": {
  "tr": "Daha sakin bir web",
  "es": "Una web más tranquila",
  "pt": "Uma web mais tranquila",
  "fr": "Un Web plus calme",
  "uk": "Спокійніший інтернет"
 },
 "Block ads & trackers": {
  "tr": "Reklamları ve izleyicileri engelle",
  "es": "Bloquear anuncios y rastreadores",
  "pt": "Bloquear anúncios e rastreadores",
  "fr": "Bloquer les publicités et traqueurs",
  "uk": "Блокувати рекламу й відстеження"
 },
 "Applies to Personal, Work and Private.": {
  "tr": "Kişisel, İş ve Özel alanlarına uygulanır.",
  "es": "Se aplica a Personal, Trabajo y Privado.",
  "pt": "Aplica-se a Pessoal, Trabalho e Privado.",
  "fr": "S’applique à Personnel, Travail et Privé.",
  "uk": "Діє в Особистому, Робочому та Приватному просторах."
 },
 "Pause on this site": {
  "tr": "Bu sitede duraklat",
  "es": "Pausar en este sitio",
  "pt": "Pausar neste site",
  "fr": "Suspendre sur ce site",
  "uk": "Призупинити на цьому сайті"
 },
 "Protect this site": {
  "tr": "Bu siteyi koru",
  "es": "Proteger este sitio",
  "pt": "Proteger este site",
  "fr": "Protéger ce site",
  "uk": "Захищати цей сайт"
 },
 "Paused sites": {
  "tr": "Duraklatılan siteler",
  "es": "Sitios en pausa",
  "pt": "Sites em pausa",
  "fr": "Sites en pause",
  "uk": "Сайти з призупиненим захистом"
 },
 "None": {
  "tr": "Yok",
  "es": "Ninguno",
  "pt": "Nenhum",
  "fr": "Aucun",
  "uk": "Немає"
 },
 "Ad and tracker protection": {
  "tr": "Reklam ve izleyici koruması",
  "es": "Protección contra anuncios y rastreadores",
  "pt": "Proteção contra anúncios e rastreadores",
  "fr": "Protection contre les publicités et traqueurs",
  "uk": "Захист від реклами й відстеження"
 },
 "Open a website to adjust protection": {
  "tr": "Korumayı ayarlamak için bir site aç",
  "es": "Abre un sitio para ajustar la protección",
  "pt": "Abra um site para ajustar a proteção",
  "fr": "Ouvrez un site pour régler la protection",
  "uk": "Відкрийте сайт для налаштування захисту"
 },
 "AI & assistants": {
  "tr": "AI ve asistanlar",
  "es": "IA y asistentes",
  "pt": "IA e assistentes",
  "fr": "IA et assistants",
  "uk": "ШІ та помічники"
 },
 "Download started": {
  "tr": "İndirme başladı",
  "es": "Descarga iniciada",
  "pt": "Transferência iniciada",
  "fr": "Téléchargement commencé",
  "uk": "Завантаження розпочато"
 },
 "Download complete": {
  "tr": "İndirme tamamlandı",
  "es": "Descarga completada",
  "pt": "Transferência concluída",
  "fr": "Téléchargement terminé",
  "uk": "Завантаження завершено"
 },
 "Rename with AI": {
  "tr": "AI ile yeniden adlandır",
  "es": "Renombrar con IA",
  "pt": "Renomear com IA",
  "fr": "Renommer avec l’IA",
  "uk": "Перейменувати за допомогою ШІ"
 },
 "Thinking…": {
  "tr": "Düşünüyor…",
  "es": "Pensando…",
  "pt": "A pensar…",
  "fr": "Réflexion…",
  "uk": "Обмірковування…"
 },
 "Suggested name": {
  "tr": "Önerilen ad",
  "es": "Nombre sugerido",
  "pt": "Nome sugerido",
  "fr": "Nom suggéré",
  "uk": "Запропонована назва"
 },
 "Apply name": {
  "tr": "Adı uygula",
  "es": "Aplicar nombre",
  "pt": "Aplicar nome",
  "fr": "Appliquer le nom",
  "uk": "Застосувати назву"
 },
 "Payment cards": {
  "tr": "Ödeme kartları",
  "es": "Tarjetas de pago",
  "pt": "Cartões de pagamento",
  "fr": "Cartes de paiement",
  "uk": "Платіжні картки"
 },
 "Add a card": {
  "tr": "Kart ekle",
  "es": "Añadir tarjeta",
  "pt": "Adicionar cartão",
  "fr": "Ajouter une carte",
  "uk": "Додати картку"
 },
 "Name on card": {
  "tr": "Kart üzerindeki ad",
  "es": "Nombre en la tarjeta",
  "pt": "Nome no cartão",
  "fr": "Nom sur la carte",
  "uk": "Ім’я на картці"
 },
 "Card number": {
  "tr": "Kart numarası",
  "es": "Número de tarjeta",
  "pt": "Número do cartão",
  "fr": "Numéro de carte",
  "uk": "Номер картки"
 },
 "Expiry month": {
  "tr": "Son kullanım ayı",
  "es": "Mes de caducidad",
  "pt": "Mês de validade",
  "fr": "Mois d’expiration",
  "uk": "Місяць закінчення дії"
 },
 "Expiry year": {
  "tr": "Son kullanım yılı",
  "es": "Año de caducidad",
  "pt": "Ano de validade",
  "fr": "Année d’expiration",
  "uk": "Рік закінчення дії"
 },
 "Save card": {
  "tr": "Kartı kaydet",
  "es": "Guardar tarjeta",
  "pt": "Guardar cartão",
  "fr": "Enregistrer la carte",
  "uk": "Зберегти картку"
 },
 "Suggestions in sign-in fields": {
  "tr": "Giriş alanlarında öneriler",
  "es": "Sugerencias en campos de acceso",
  "pt": "Sugestões nos campos de início de sessão",
  "fr": "Suggestions dans les champs de connexion",
  "uk": "Підказки в полях входу"
 },
 "Saved accounts": {
  "tr": "Kayıtlı hesaplar",
  "es": "Cuentas guardadas",
  "pt": "Contas guardadas",
  "fr": "Comptes enregistrés",
  "uk": "Збережені облікові записи"
 },
 "Saved cards": {
  "tr": "Kayıtlı kartlar",
  "es": "Tarjetas guardadas",
  "pt": "Cartões guardados",
  "fr": "Cartes enregistrées",
  "uk": "Збережені картки"
 },
 "Saved password": {
  "tr": "Kayıtlı parola",
  "es": "Contraseña guardada",
  "pt": "Palavra-passe guardada",
  "fr": "Mot de passe enregistré",
  "uk": "Збережений пароль"
 },
 "Prism · Review, then sign in": {
  "tr": "Prism · Kontrol et, sonra giriş yap",
  "es": "Prism · Revisa y luego inicia sesión",
  "pt": "Prism · Reveja e inicie sessão",
  "fr": "Prism · Vérifiez, puis connectez-vous",
  "uk": "Prism · Перевірте та увійдіть"
 },
 "Prism · Card details only, never CVC": {
  "tr": "Prism · Yalnızca kart bilgileri, CVC hariç",
  "es": "Prism · Solo datos de tarjeta, nunca CVC",
  "pt": "Prism · Só dados do cartão, nunca CVC",
  "fr": "Prism · Détails de carte uniquement, jamais le CVC",
  "uk": "Prism · Лише дані картки, без CVC"
 },
 "Open ChatGPT": {
  "tr": "ChatGPT’yi aç",
  "es": "Abrir ChatGPT",
  "pt": "Abrir ChatGPT",
  "fr": "Ouvrir ChatGPT",
  "uk": "Відкрити ChatGPT"
 },
 "Open Shortcuts": {
  "tr": "Kestirmeler’i aç",
  "es": "Abrir Atajos",
  "pt": "Abrir Atalhos",
  "fr": "Ouvrir Raccourcis",
  "uk": "Відкрити Команди"
 },
 "Check availability": {
  "tr": "Kullanılabilirliği denetle",
  "es": "Comprobar disponibilidad",
  "pt": "Verificar disponibilidade",
  "fr": "Vérifier la disponibilité",
  "uk": "Перевірити доступність"
 },
 "Save key": {
  "tr": "Anahtarı kaydet",
  "es": "Guardar clave",
  "pt": "Guardar chave",
  "fr": "Enregistrer la clé",
  "uk": "Зберегти ключ"
 },
 "Remove key": {
  "tr": "Anahtarı kaldır",
  "es": "Eliminar clave",
  "pt": "Remover chave",
  "fr": "Supprimer la clé",
  "uk": "Видалити ключ"
 },
 "Search settings": {
  "tr": "Ayarlarda ara",
  "es": "Buscar ajustes",
  "pt": "Buscar definições",
  "fr": "Rechercher dans les réglages",
  "uk": "Пошук у налаштуваннях"
 },
 "Privacy & security": {
  "tr": "Gizlilik ve güvenlik",
  "es": "Privacidad y seguridad",
  "pt": "Privacidade e segurança",
  "fr": "Confidentialité et sécurité",
  "uk": "Приватність і безпека"
 },
 "Intelligence": {
  "tr": "Yapay zekâ",
  "es": "Inteligencia",
  "pt": "Inteligência",
  "fr": "Intelligence",
  "uk": "Інтелектуальні функції"
 },
 "Matches": {
  "tr": "eşleşme",
  "es": "coincidencias",
  "pt": "resultados",
  "fr": "résultats",
  "uk": "збігів"
 },
 "No matching settings": {
  "tr": "Eşleşen ayar yok",
  "es": "No hay ajustes coincidentes",
  "pt": "Nenhuma definição correspondente",
  "fr": "Aucun réglage correspondant",
  "uk": "Налаштувань не знайдено"
 },
 "Match": {
  "tr": "eşleşme",
  "es": "coincidencia",
  "pt": "resultado",
  "fr": "résultat",
  "uk": "збіг"
 },
 "Profile": {
  "tr": "Profil",
  "es": "Perfil",
  "pt": "Perfil",
  "fr": "Profil",
  "uk": "Профіль"
 },
 "Tabs & layout": {
  "tr": "Sekmeler ve düzen",
  "es": "Pestañas y diseño",
  "pt": "Separadores e disposição",
  "fr": "Onglets et disposition",
  "uk": "Вкладки й розташування"
 },
 "Browsing": {
  "tr": "Gezinme",
  "es": "Navegación",
  "pt": "Navegação",
  "fr": "Navigation",
  "uk": "Перегляд"
 },
 "Page assistant": {
  "tr": "Sayfa asistanı",
  "es": "Asistente de página",
  "pt": "Assistente de página",
  "fr": "Assistant de page",
  "uk": "Помічник сторінки"
 },
 "System": {
  "tr": "Sistem",
  "es": "Sistema",
  "pt": "Sistema",
  "fr": "Système",
  "uk": "Система"
 },
 "Saved accounts appear when you focus a sign-in field. Choose an account to fill it; Prism never submits the form.": {
  "tr": "Bir giriş alanına odaklandığında kayıtlı hesaplar görünür. Doldurmak için bir hesap seç; Prism formu asla göndermez.",
  "es": "Las cuentas guardadas aparecen al seleccionar un campo de inicio de sesión. Elige una cuenta para rellenarlo; Prism nunca envía el formulario.",
  "pt": "As contas guardadas aparecem quando seleciona um campo de início de sessão. Escolha uma conta para o preencher; o Prism nunca envia o formulário.",
  "fr": "Les comptes enregistrés apparaissent lorsque vous sélectionnez un champ de connexion. Choisissez un compte pour le remplir ; Prism n’envoie jamais le formulaire.",
  "uk": "Збережені облікові записи з’являються, коли ви переходите до поля входу. Виберіть обліковий запис, щоб заповнити його; Prism ніколи не надсилає форму."
 },
 "Choose a saved account directly on the page. HTTPS sites only.": {
  "tr": "Kayıtlı bir hesabı doğrudan sayfada seç. Yalnızca HTTPS siteleri.",
  "es": "Elige una cuenta guardada directamente en la página. Solo sitios HTTPS.",
  "pt": "Escolha uma conta guardada diretamente na página. Apenas sites HTTPS.",
  "fr": "Choisissez un compte enregistré directement sur la page. Sites HTTPS uniquement.",
  "uk": "Вибирайте збережений обліковий запис просто на сторінці. Лише сайти HTTPS."
 },
 "Encrypted on this Mac. Fill from a card field’s dropdown. Security codes are never stored or filled.": {
  "tr": "Bu Mac’te şifrelenir. Kart alanının açılır menüsünden doldur. Güvenlik kodları asla saklanmaz veya doldurulmaz.",
  "es": "Cifradas en este Mac. Rellena desde el menú desplegable de un campo de tarjeta. Los códigos de seguridad nunca se guardan ni se rellenan.",
  "pt": "Encriptados neste Mac. Preencha a partir do menu pendente de um campo de cartão. Os códigos de segurança nunca são guardados nem preenchidos.",
  "fr": "Chiffrées sur ce Mac. Remplissez depuis le menu déroulant d’un champ de carte. Les codes de sécurité ne sont jamais enregistrés ni remplis.",
  "uk": "Зашифровано на цьому Mac. Заповнюйте з розкривного меню поля картки. Коди безпеки ніколи не зберігаються й не заповнюються."
 },
 "Logins are encrypted using macOS Keychain.": {
  "tr": "Girişler macOS Anahtar Zinciri ile şifrelenir.",
  "es": "Los inicios de sesión se cifran con el Llavero de macOS.",
  "pt": "Os inícios de sessão são encriptados com o Porta-chaves do macOS.",
  "fr": "Les identifiants sont chiffrés avec le Trousseau macOS.",
  "uk": "Дані входу зашифровано за допомогою В’язки ключів macOS."
 },
 "encrypted using macOS Keychain.": {
  "tr": "macOS Anahtar Zinciri ile şifreli.",
  "es": "cifrados con el Llavero de macOS.",
  "pt": "encriptados com o Porta-chaves do macOS.",
  "fr": "chiffrés avec le Trousseau macOS.",
  "uk": "зашифровано за допомогою В’язки ключів macOS."
 },
 "saved login": {
  "tr": "kayıtlı giriş",
  "es": "inicio de sesión guardado",
  "pt": "início de sessão guardado",
  "fr": "identifiant enregistré",
  "uk": "збережений вхід"
 },
 "saved logins": {
  "tr": "kayıtlı giriş",
  "es": "inicios de sesión guardados",
  "pt": "inícios de sessão guardados",
  "fr": "identifiants enregistrés",
  "uk": "збережених входів"
 },
 "Showing first 200; search to narrow results": {
  "tr": "İlk 200 gösteriliyor; daraltmak için ara",
  "es": "Se muestran los primeros 200; busca para acotar",
  "pt": "A mostrar os primeiros 200; pesquise para restringir",
  "fr": "200 premiers affichés ; recherchez pour affiner",
  "uk": "Показано перші 200; уточніть пошуком"
 },
 "Apple Passwords & imports": {
  "tr": "Apple Parolalar ve içe aktarma",
  "es": "Contraseñas de Apple e importaciones",
  "pt": "Palavras-passe da Apple e importações",
  "fr": "Mots de passe Apple et importations",
  "uk": "Паролі Apple та імпорт"
 },
 "The official iCloud Passwords extension could not connect to Apple’s helper in this build. Direct iCloud autofill and sync are unavailable. Open Apple's Passwords app to look up a login, or export selected passwords there and import the CSV into Prism. Imported passwords are a separate, encrypted copy on this Mac.": {
  "tr": "Resmî iCloud Parolaları uzantısı bu sürümde Apple’ın yardımcısına bağlanamadı. Doğrudan iCloud otomatik doldurma ve eşzamanlama kullanılamıyor. Bir girişi bulmak için Apple’ın Parolalar uygulamasını aç ya da oradan seçili parolaları dışa aktarıp CSV dosyasını Prism’e aktar. İçe aktarılan parolalar bu Mac’te ayrı, şifreli bir kopyadır.",
  "es": "La extensión oficial Contraseñas de iCloud no pudo conectarse con el asistente de Apple en esta versión. El autorrelleno y la sincronización directos con iCloud no están disponibles. Abre la app Contraseñas de Apple para consultar un inicio de sesión, o exporta allí las contraseñas seleccionadas e importa el CSV en Prism. Las contraseñas importadas son una copia independiente y cifrada en este Mac.",
  "pt": "A extensão oficial Palavras-passe do iCloud não conseguiu ligar-se ao assistente da Apple nesta versão. O preenchimento automático e a sincronização diretos com o iCloud não estão disponíveis. Abra a app Palavras-passe da Apple para consultar um início de sessão, ou exporte aí as palavras-passe selecionadas e importe o CSV para o Prism. As palavras-passe importadas são uma cópia separada e encriptada neste Mac.",
  "fr": "L’extension officielle Mots de passe iCloud n’a pas pu se connecter à l’assistant d’Apple dans cette version. Le remplissage automatique et la synchronisation iCloud directs ne sont pas disponibles. Ouvrez l’app Mots de passe d’Apple pour retrouver un identifiant, ou exportez-y les mots de passe choisis puis importez le fichier CSV dans Prism. Les mots de passe importés sont une copie distincte et chiffrée sur ce Mac.",
  "uk": "Офіційне розширення «Паролі iCloud» не змогло під’єднатися до помічника Apple у цій збірці. Пряме автозаповнення й синхронізація iCloud недоступні. Відкрийте застосунок «Паролі» від Apple, щоб знайти дані входу, або експортуйте там вибрані паролі й імпортуйте CSV у Prism. Імпортовані паролі — це окрема зашифрована копія на цьому Mac."
 },
 "Keyboard shortcuts: ⌘L address · ⌘T new tab · ⌘D bookmark · ⌘, settings · ⌘J downloads. Focus the sidebar divider and use arrow keys to resize.": {
  "tr": "Klavye kısayolları: ⌘L adres · ⌘T yeni sekme · ⌘D yer imi · ⌘, ayarlar · ⌘J indirilenler. Boyutlandırmak için kenar çubuğu ayırıcısına odaklan ve ok tuşlarını kullan.",
  "es": "Atajos de teclado: ⌘L dirección · ⌘T nueva pestaña · ⌘D marcador · ⌘, ajustes · ⌘J descargas. Selecciona el divisor de la barra lateral y usa las flechas para cambiar su tamaño.",
  "pt": "Atalhos de teclado: ⌘L endereço · ⌘T novo separador · ⌘D marcador · ⌘, definições · ⌘J transferências. Selecione o divisor da barra lateral e use as setas para redimensionar.",
  "fr": "Raccourcis clavier : ⌘L adresse · ⌘T nouvel onglet · ⌘D signet · ⌘, réglages · ⌘J téléchargements. Sélectionnez le séparateur de la barre latérale et utilisez les flèches pour redimensionner.",
  "uk": "Клавіатурні скорочення: ⌘L адреса · ⌘T нова вкладка · ⌘D закладка · ⌘, налаштування · ⌘J завантаження. Перейдіть до роздільника бічної панелі й змінюйте розмір клавішами зі стрілками."
 },
 "This page": {
  "tr": "Bu sayfa",
  "es": "Esta página",
  "pt": "Esta página",
  "fr": "Cette page",
  "uk": "Ця сторінка"
 },
 "Open “{app}”?": {
  "tr": "“{app}” açılsın mı?",
  "es": "¿Abrir “{app}”?",
  "pt": "Abrir “{app}”?",
  "fr": "Ouvrir « {app} » ?",
  "uk": "Відкрити «{app}»?"
 },
 "{site} wants to open this link with {app}.": {
  "tr": "{site}, bu bağlantıyı {app} ile açmak istiyor.",
  "es": "{site} quiere abrir este enlace con {app}.",
  "pt": "{site} pretende abrir esta ligação com {app}.",
  "fr": "{site} souhaite ouvrir ce lien avec {app}.",
  "uk": "{site} хоче відкрити це посилання в {app}."
 },
 "Open {app}": {
  "tr": "{app} uygulamasını aç",
  "es": "Abrir {app}",
  "pt": "Abrir {app}",
  "fr": "Ouvrir {app}",
  "uk": "Відкрити {app}"
 },
 "Always allow {site} to open these links": {
  "tr": "{site} bu bağlantıları her zaman açabilsin",
  "es": "Permitir siempre que {site} abra estos enlaces",
  "pt": "Permitir sempre que {site} abra estas ligações",
  "fr": "Toujours autoriser {site} à ouvrir ces liens",
  "uk": "Завжди дозволяти {site} відкривати такі посилання"
 },
 "Welcome": {
  "tr": "Hoş geldin",
  "es": "Bienvenida",
  "pt": "Boas-vindas",
  "fr": "Bienvenue",
  "uk": "Вітаємо"
 },
 "Look": {
  "tr": "Görünüm",
  "es": "Aspecto",
  "pt": "Aspeto",
  "fr": "Style",
  "uk": "Стиль"
 },
 "Places": {
  "tr": "Yerler",
  "es": "Lugares",
  "pt": "Locais",
  "fr": "Lieux",
  "uk": "Місця"
 },
 "Logins": {
  "tr": "Girişler",
  "es": "Inicios de sesión",
  "pt": "Inícios de sessão",
  "fr": "Identifiants",
  "uk": "Дані входу"
 },
 "Default browser": {
  "tr": "Varsayılan tarayıcı",
  "es": "Navegador predeterminado",
  "pt": "Navegador predefinido",
  "fr": "Navigateur par défaut",
  "uk": "Типовий браузер"
 },
 "Sidebar & tabs": {
  "tr": "Kenar çubuğu ve sekmeler",
  "es": "Barra lateral y pestañas",
  "pt": "Barra lateral e separadores",
  "fr": "Barre latérale et onglets",
  "uk": "Бічна панель і вкладки"
 },
 "Privacy": {
  "tr": "Gizlilik",
  "es": "Privacidad",
  "pt": "Privacidade",
  "fr": "Confidentialité",
  "uk": "Приватність"
 },
 "Your sidebar, your rhythm.": {
  "tr": "Kenar çubuğun, senin ritmin.",
  "es": "Tu barra lateral, a tu ritmo.",
  "pt": "A sua barra lateral, ao seu ritmo.",
  "fr": "Votre barre latérale, à votre rythme.",
  "uk": "Ваша бічна панель — ваш ритм."
 },
 "Tabs stay tidy on the left, out of your way.": {
  "tr": "Sekmeler solda düzenli kalır, yolunu kesmez.",
  "es": "Las pestañas se mantienen ordenadas a la izquierda, sin estorbar.",
  "pt": "Os separadores ficam arrumados à esquerda, sem atrapalhar.",
  "fr": "Les onglets restent rangés à gauche, sans vous gêner.",
  "uk": "Вкладки охайно тримаються ліворуч і не заважають."
 },
 "Private by design.": {
  "tr": "Özünde gizli.",
  "es": "Privado por diseño.",
  "pt": "Privado por natureza.",
  "fr": "Confidentiel par conception.",
  "uk": "Приватність за задумом."
 },
 "Protection is built in, and you stay in control.": {
  "tr": "Koruma yerleşik gelir, kontrol sende kalır.",
  "es": "La protección viene integrada y tú mantienes el control.",
  "pt": "A proteção vem incluída e o controlo é seu.",
  "fr": "La protection est intégrée, et vous gardez le contrôle.",
  "uk": "Захист вбудовано, а керування — у ваших руках."
 },
 "Ads and trackers are blocked in every space.": {
  "tr": "Reklamlar ve izleyiciler her alanda engellenir.",
  "es": "Los anuncios y rastreadores se bloquean en todos los espacios.",
  "pt": "Os anúncios e rastreadores são bloqueados em todos os espaços.",
  "fr": "Les publicités et traqueurs sont bloqués dans chaque espace.",
  "uk": "Реклама й трекери блокуються в кожному просторі."
 },
 "Passwords stay encrypted on this Mac. Prism never submits a form for you.": {
  "tr": "Parolalar bu Mac’te şifreli kalır. Prism formları asla senin yerine göndermez.",
  "es": "Las contraseñas permanecen cifradas en este Mac. Prism nunca envía un formulario por ti.",
  "pt": "As palavras-passe ficam encriptadas neste Mac. O Prism nunca envia um formulário por si.",
  "fr": "Les mots de passe restent chiffrés sur ce Mac. Prism n’envoie jamais un formulaire à votre place.",
  "uk": "Паролі залишаються зашифрованими на цьому Mac. Prism ніколи не надсилає форму замість вас."
 },
 "Links that open other apps always ask first.": {
  "tr": "Başka uygulamaları açan bağlantılar her zaman önce sorar.",
  "es": "Los enlaces que abren otras apps siempre preguntan primero.",
  "pt": "As ligações que abrem outras apps perguntam sempre primeiro.",
  "fr": "Les liens qui ouvrent d’autres apps demandent toujours d’abord.",
  "uk": "Посилання, що відкривають інші застосунки, завжди спершу запитують."
 },
 "Choose an exported password CSV to begin.": {
  "tr": "Başlamak için dışa aktarılmış bir parola CSV’si seç.",
  "es": "Elige un CSV de contraseñas exportado para empezar.",
  "pt": "Escolha um CSV de palavras-passe exportado para começar.",
  "fr": "Choisissez un export CSV de mots de passe pour commencer.",
  "uk": "Щоб почати, виберіть експортований CSV із паролями."
 },
 "Personal and Work share their normal sign-ins. Private has temporary cookies and no extensions, saved logins or persisted tab history. Downloaded files remain on disk.": {
  "tr": "Kişisel ve İş alanları normal oturumlarını paylaşır. Özel; geçici çerezler kullanır, uzantı, kayıtlı giriş veya kalıcı sekme geçmişi içermez. İndirilen dosyalar diskte kalır.",
  "es": "Personal y Trabajo comparten sus sesiones habituales. Privado usa cookies temporales y no tiene extensiones, inicios de sesión guardados ni historial de pestañas persistente. Los archivos descargados permanecen en el disco.",
  "pt": "Pessoal e Trabalho partilham as sessões habituais. Privado usa cookies temporários e não tem extensões, inícios de sessão guardados nem histórico de separadores persistente. Os ficheiros transferidos ficam no disco.",
  "fr": "Personnel et Travail partagent leurs connexions habituelles. Privé utilise des cookies temporaires, sans extensions, identifiants enregistrés ni historique d’onglets conservé. Les fichiers téléchargés restent sur le disque.",
  "uk": "Особистий і Робочий простори мають спільні звичайні входи. Приватний використовує тимчасові файли cookie і не має розширень, збережених входів чи постійної історії вкладок. Завантажені файли залишаються на диску."
 },
 "Bypass censorship starts with your first Private site and stays on until you end Private or change the connection.": {
  "tr": "Sansürü aş, ilk Özel sitede başlar ve Özel’i bitirene ya da bağlantıyı değiştirene kadar açık kalır.",
  "es": "Evitar la censura se activa con el primer sitio privado y sigue activo hasta que termines Privado o cambies la conexión.",
  "pt": "Contornar a censura começa com o primeiro site privado e continua ativo até terminar o Privado ou mudar a ligação.",
  "fr": "Contourner la censure démarre avec le premier site privé et reste actif jusqu’à la fin de Privé ou un changement de connexion.",
  "uk": "Обхід цензури вмикається з першим приватним сайтом і працює, доки ви не завершите Приватний режим або не зміните з’єднання."
 },
 "Bypass method": {
  "tr": "Aşma yöntemi",
  "es": "Método de evasión",
  "pt": "Método de contorno",
  "fr": "Méthode de contournement",
  "uk": "Спосіб обходу"
 },
 "Standard (recommended)": {
  "tr": "Standart (önerilen)",
  "es": "Estándar (recomendado)",
  "pt": "Padrão (recomendado)",
  "fr": "Standard (recommandé)",
  "uk": "Стандартний (рекомендовано)"
 },
 "Alternative (TLS)": {
  "tr": "Alternatif (TLS)",
  "es": "Alternativo (TLS)",
  "pt": "Alternativo (TLS)",
  "fr": "Alternative (TLS)",
  "uk": "Альтернативний (TLS)"
 },
 "Diagnostic (no bypass)": {
  "tr": "Tanılama (aşma yok)",
  "es": "Diagnóstico (sin evasión)",
  "pt": "Diagnóstico (sem contorno)",
  "fr": "Diagnostic (sans contournement)",
  "uk": "Діагностика (без обходу)"
 },
 "Start bypass": {
  "tr": "Aşmayı başlat",
  "es": "Iniciar evasión",
  "pt": "Iniciar contorno",
  "fr": "Démarrer le contournement",
  "uk": "Запустити обхід"
 },
 "Stop & block": {
  "tr": "Durdur ve engelle",
  "es": "Detener y bloquear",
  "pt": "Parar e bloquear",
  "fr": "Arrêter et bloquer",
  "uk": "Зупинити й блокувати"
 },
 "Use Direct": {
  "tr": "Doğrudan kullan",
  "es": "Usar conexión directa",
  "pt": "Usar ligação direta",
  "fr": "Utiliser la connexion directe",
  "uk": "Пряме з’єднання"
 },
 "While it runs, Prism splits the first packets of each connection so filters can’t read them, and looks up sites over encrypted DNS (Cloudflare, Google) so blocked addresses resolve correctly. It uses the installed tpws helper from the open-source Zapret project and never changes system settings. If it fails, Private requests stay blocked; Prism never switches to Direct by itself. It is not a VPN: sites still see your IP address.": {
  "tr": "Çalışırken Prism, filtrelerin okuyamaması için her bağlantının ilk paketlerini böler ve engellenen adreslerin doğru çözülmesi için siteleri şifreli DNS (Cloudflare, Google) üzerinden arar. Açık kaynaklı Zapret projesindeki kurulu tpws yardımcısını kullanır ve sistem ayarlarını değiştirmez. Başarısız olursa Özel istekler engelli kalır; Prism kendiliğinden Doğrudan’a geçmez. Bu bir VPN değildir: siteler IP adresini görmeye devam eder.",
  "es": "Mientras funciona, Prism divide los primeros paquetes de cada conexión para que los filtros no puedan leerlos y busca los sitios mediante DNS cifrado (Cloudflare, Google) para que las direcciones bloqueadas se resuelvan correctamente. Usa el asistente tpws instalado, del proyecto de código abierto Zapret, y nunca cambia los ajustes del sistema. Si falla, las solicitudes privadas siguen bloqueadas; Prism nunca cambia a conexión directa por sí solo. No es una VPN: los sitios siguen viendo tu dirección IP.",
  "pt": "Enquanto funciona, o Prism divide os primeiros pacotes de cada ligação para que os filtros não os consigam ler e procura os sites através de DNS encriptado (Cloudflare, Google) para que os endereços bloqueados sejam resolvidos corretamente. Usa o assistente tpws instalado, do projeto de código aberto Zapret, e nunca altera as definições do sistema. Se falhar, os pedidos privados continuam bloqueados; o Prism nunca muda para ligação direta sozinho. Não é uma VPN: os sites continuam a ver o seu endereço IP.",
  "fr": "Pendant son fonctionnement, Prism fragmente les premiers paquets de chaque connexion pour que les filtres ne puissent pas les lire et résout les sites via un DNS chiffré (Cloudflare, Google) afin que les adresses bloquées soient correctement trouvées. Il utilise l’outil tpws installé, issu du projet open source Zapret, et ne modifie jamais les réglages du système. En cas d’échec, les requêtes privées restent bloquées ; Prism ne passe jamais en connexion directe de lui-même. Ce n’est pas un VPN : les sites voient toujours votre adresse IP.",
  "uk": "Під час роботи Prism розбиває перші пакети кожного з’єднання, щоб фільтри не могли їх прочитати, і шукає сайти через зашифрований DNS (Cloudflare, Google), щоб заблоковані адреси визначалися правильно. Використовується встановлений помічник tpws із проєкту з відкритим кодом Zapret, системні налаштування не змінюються. Якщо щось не працює, приватні запити залишаються заблокованими; Prism ніколи сам не перемикається на пряме з’єднання. Це не VPN: сайти й надалі бачать вашу IP-адресу."
 },
 "Bypass censorship starts automatically when you open a Private site.": {
  "tr": "Sansürü aş, bir Özel site açtığında otomatik başlar.",
  "es": "Evitar la censura se inicia automáticamente al abrir un sitio privado.",
  "pt": "Contornar a censura começa automaticamente quando abre um site privado.",
  "fr": "Contourner la censure démarre automatiquement à l’ouverture d’un site privé.",
  "uk": "Обхід цензури запускається автоматично, коли ви відкриваєте приватний сайт."
 },
 "Changing Private connection…": {
  "tr": "Özel bağlantı değiştiriliyor…",
  "es": "Cambiando la conexión privada…",
  "pt": "A mudar a ligação privada…",
  "fr": "Changement de la connexion privée…",
  "uk": "Змінення приватного з’єднання…"
 },
 "Private uses your normal connection.": {
  "tr": "Özel, normal bağlantını kullanıyor.",
  "es": "Privado usa tu conexión normal.",
  "pt": "O Privado usa a sua ligação normal.",
  "fr": "Privé utilise votre connexion normale.",
  "uk": "Приватний режим використовує звичайне з’єднання."
 },
 "Private network stopped. Choose Direct or start the bypass to continue.": {
  "tr": "Özel ağ durduruldu. Devam etmek için Doğrudan’ı seç ya da aşmayı başlat.",
  "es": "Red privada detenida. Elige Directa o inicia la evasión para continuar.",
  "pt": "Rede privada parada. Escolha Direta ou inicie o contorno para continuar.",
  "fr": "Réseau privé arrêté. Choisissez Directe ou démarrez le contournement pour continuer.",
  "uk": "Приватну мережу зупинено. Щоб продовжити, виберіть пряме з’єднання або запустіть обхід."
 },
 "Bypass censorship is on for Private browsing.": {
  "tr": "Sansürü aş, Özel gezinme için açık.",
  "es": "Evitar la censura está activo para la navegación privada.",
  "pt": "Contornar a censura está ativo para a navegação privada.",
  "fr": "Contourner la censure est actif pour la navigation privée.",
  "uk": "Обхід цензури увімкнено для приватного перегляду."
 },
 "The bypass helper could not start. Check the installed tpws version.": {
  "tr": "Aşma yardımcısı başlatılamadı. Kurulu tpws sürümünü kontrol et.",
  "es": "No se pudo iniciar el asistente de evasión. Comprueba la versión de tpws instalada.",
  "pt": "Não foi possível iniciar o assistente de contorno. Verifique a versão do tpws instalada.",
  "fr": "L’outil de contournement n’a pas pu démarrer. Vérifiez la version de tpws installée.",
  "uk": "Не вдалося запустити помічник обходу. Перевірте встановлену версію tpws."
 },
 "The bypass helper could not start.": {
  "tr": "Aşma yardımcısı başlatılamadı.",
  "es": "No se pudo iniciar el asistente de evasión.",
  "pt": "Não foi possível iniciar o assistente de contorno.",
  "fr": "L’outil de contournement n’a pas pu démarrer.",
  "uk": "Не вдалося запустити помічник обходу."
 },
 "The bypass helper did not become ready. Private requests remain blocked.": {
  "tr": "Aşma yardımcısı hazır hale gelmedi. Özel istekler engelli kalıyor.",
  "es": "El asistente de evasión no estuvo listo. Las solicitudes privadas siguen bloqueadas.",
  "pt": "O assistente de contorno não ficou pronto. Os pedidos privados continuam bloqueados.",
  "fr": "L’outil de contournement n’est pas prêt. Les requêtes privées restent bloquées.",
  "uk": "Помічник обходу не встиг запуститися. Приватні запити залишаються заблокованими."
 },
 "The bypass helper stopped. Private requests are blocked until you restart it or choose Direct.": {
  "tr": "Aşma yardımcısı durdu. Yeniden başlatana ya da Doğrudan’ı seçene kadar Özel istekler engelli.",
  "es": "El asistente de evasión se detuvo. Las solicitudes privadas quedan bloqueadas hasta que lo reinicies o elijas Directa.",
  "pt": "O assistente de contorno parou. Os pedidos privados ficam bloqueados até o reiniciar ou escolher Direta.",
  "fr": "L’outil de contournement s’est arrêté. Les requêtes privées sont bloquées jusqu’à son redémarrage ou le choix de Directe.",
  "uk": "Помічник обходу зупинився. Приватні запити заблоковано, доки ви не перезапустите його або не виберете пряме з’єднання."
 },
 "The bypass helper must not be writable by other users.": {
  "tr": "Aşma yardımcısı başka kullanıcılar tarafından yazılabilir olmamalı.",
  "es": "El asistente de evasión no debe poder ser modificado por otros usuarios.",
  "pt": "O assistente de contorno não pode ser editável por outros utilizadores.",
  "fr": "L’outil de contournement ne doit pas être modifiable par d’autres utilisateurs.",
  "uk": "Помічник обходу не має бути доступним для запису іншим користувачам."
 },
 "Private uses temporary site data and can bypass censorship from its first site when the helper is installed. If it can’t start, requests stay blocked. Private is not a VPN.": {
  "tr": "Özel, geçici site verisi kullanır ve yardımcı kuruluysa ilk siteden itibaren sansürü aşabilir. Başlayamazsa istekler engelli kalır. Özel bir VPN değildir.",
  "es": "Privado usa datos temporales y puede evitar la censura desde el primer sitio si el asistente está instalado. Si no arranca, las solicitudes siguen bloqueadas. Privado no es una VPN.",
  "pt": "O Privado usa dados temporários e pode contornar a censura desde o primeiro site se o assistente estiver instalado. Se falhar, os pedidos continuam bloqueados. O Privado não é uma VPN.",
  "fr": "Privé utilise des données temporaires et peut contourner la censure dès le premier site si l’outil est installé. En cas d’échec, les requêtes restent bloquées. Privé n’est pas un VPN.",
  "uk": "Приватний режим використовує тимчасові дані й може обходити цензуру з першого сайту, якщо помічник установлено. Якщо запуск не вдається, запити залишаються заблокованими. Приватний режим — не VPN."
 },
 "Bypass censorship": {
  "tr": "Sansürü aş",
  "es": "Evitar la censura",
  "pt": "Contornar a censura",
  "fr": "Contourner la censure",
  "uk": "Обхід цензури"
 },
 "Link copied": {
  "tr": "Bağlantı kopyalandı",
  "es": "Enlace copiado",
  "pt": "Ligação copiada",
  "fr": "Lien copié",
  "uk": "Посилання скопійовано"
 },
 "Bookmarked": {
  "tr": "Yer imlerine eklendi",
  "es": "Añadido a marcadores",
  "pt": "Adicionado aos marcadores",
  "fr": "Ajouté aux signets",
  "uk": "Додано до закладок"
 },
 "Bookmark removed": {
  "tr": "Yer imi kaldırıldı",
  "es": "Marcador eliminado",
  "pt": "Marcador removido",
  "fr": "Signet supprimé",
  "uk": "Закладку видалено"
 },
 "Reloaded": {
  "tr": "Yenilendi",
  "es": "Recargada",
  "pt": "Recarregada",
  "fr": "Rechargée",
  "uk": "Оновлено"
 },
 "Reloaded without cache": {
  "tr": "Önbelleksiz yenilendi",
  "es": "Recargada sin caché",
  "pt": "Recarregada sem cache",
  "fr": "Rechargée sans cache",
  "uk": "Оновлено без кешу"
 },
 "Unpinned": {
  "tr": "Sabitleme kaldırıldı",
  "es": "Desfijada",
  "pt": "Desafixado",
  "fr": "Désépinglé",
  "uk": "Відкріплено"
 },
 "Tab reopened": {
  "tr": "Sekme yeniden açıldı",
  "es": "Pestaña reabierta",
  "pt": "Separador reaberto",
  "fr": "Onglet rouvert",
  "uk": "Вкладку знову відкрито"
 },
 "Zoom {n}%": {
  "tr": "Yakınlaştırma %{n}",
  "es": "Zoom {n} %",
  "pt": "Zoom {n}%",
  "fr": "Zoom {n} %",
  "uk": "Масштаб {n}%"
 },
 "Reload without cache": {
  "tr": "Önbelleksiz yenile",
  "es": "Recargar sin caché",
  "pt": "Recarregar sem cache",
  "fr": "Recharger sans cache",
  "uk": "Оновити без кешу"
 },
 "Zoom in": {
  "tr": "Yakınlaştır",
  "es": "Acercar",
  "pt": "Ampliar",
  "fr": "Zoom avant",
  "uk": "Збільшити"
 },
 "Zoom out": {
  "tr": "Uzaklaştır",
  "es": "Alejar",
  "pt": "Reduzir",
  "fr": "Zoom arrière",
  "uk": "Зменшити"
 },
 "Actual size": {
  "tr": "Gerçek boyut",
  "es": "Tamaño real",
  "pt": "Tamanho real",
  "fr": "Taille réelle",
  "uk": "Фактичний розмір"
 },
 "Rename tab…": {
  "tr": "Sekmeyi yeniden adlandır…",
  "es": "Cambiar nombre de la pestaña…",
  "pt": "Mudar o nome do separador…",
  "fr": "Renommer l’onglet…",
  "uk": "Перейменувати вкладку…"
 },
 "Use page title": {
  "tr": "Sayfa başlığını kullan",
  "es": "Usar el título de la página",
  "pt": "Usar o título da página",
  "fr": "Utiliser le titre de la page",
  "uk": "Використати назву сторінки"
 },
 "Pin tab": {
  "tr": "Sekmeyi sabitle",
  "es": "Fijar pestaña",
  "pt": "Fixar separador",
  "fr": "Épingler l’onglet",
  "uk": "Закріпити вкладку"
 },
 "Unpin tab": {
  "tr": "Sekme sabitlemesini kaldır",
  "es": "Desfijar pestaña",
  "pt": "Desafixar separador",
  "fr": "Désépingler l’onglet",
  "uk": "Відкріпити вкладку"
 },
 "Duplicate tab": {
  "tr": "Sekmeyi çoğalt",
  "es": "Duplicar pestaña",
  "pt": "Duplicar separador",
  "fr": "Dupliquer l’onglet",
  "uk": "Дублювати вкладку"
 },
 "Add to folder": {
  "tr": "Klasöre ekle",
  "es": "Añadir a carpeta",
  "pt": "Adicionar à pasta",
  "fr": "Ajouter au dossier",
  "uk": "Додати до папки"
 },
 "Split with current tab": {
  "tr": "Geçerli sekmeyle böl",
  "es": "Dividir con la pestaña actual",
  "pt": "Dividir com o separador atual",
  "fr": "Partager avec l’onglet actuel",
  "uk": "Розділити з поточною вкладкою"
 },
 "Close other tabs": {
  "tr": "Diğer sekmeleri kapat",
  "es": "Cerrar las demás pestañas",
  "pt": "Fechar os outros separadores",
  "fr": "Fermer les autres onglets",
  "uk": "Закрити інші вкладки"
 },
 "Close tabs below": {
  "tr": "Alttaki sekmeleri kapat",
  "es": "Cerrar las pestañas de abajo",
  "pt": "Fechar os separadores abaixo",
  "fr": "Fermer les onglets en dessous",
  "uk": "Закрити вкладки нижче"
 },
 "Rename folder…": {
  "tr": "Klasörü yeniden adlandır…",
  "es": "Cambiar nombre de la carpeta…",
  "pt": "Mudar o nome da pasta…",
  "fr": "Renommer le dossier…",
  "uk": "Перейменувати папку…"
 },
 "Add bookmark…": {
  "tr": "Yer imi ekle…",
  "es": "Añadir marcador…",
  "pt": "Adicionar marcador…",
  "fr": "Ajouter un signet…",
  "uk": "Додати закладку…"
 },
 "Remove folder, keep bookmarks": {
  "tr": "Klasörü kaldır, yer imlerini koru",
  "es": "Quitar carpeta y conservar marcadores",
  "pt": "Remover pasta e manter marcadores",
  "fr": "Supprimer le dossier, garder les signets",
  "uk": "Видалити папку, зберегти закладки"
 },
 "Delete folder and its bookmarks": {
  "tr": "Klasörü ve yer imlerini sil",
  "es": "Eliminar la carpeta y sus marcadores",
  "pt": "Eliminar a pasta e os marcadores",
  "fr": "Supprimer le dossier et ses signets",
  "uk": "Видалити папку та її закладки"
 },
 "Open in Instagram Mobile": {
  "tr": "Instagram Mobil’de aç",
  "es": "Abrir en Instagram móvil",
  "pt": "Abrir no Instagram móvel",
  "fr": "Ouvrir dans Instagram mobile",
  "uk": "Відкрити в мобільному Instagram"
 },
 "Add to Favorites": {
  "tr": "Favorilere ekle",
  "es": "Añadir a favoritos",
  "pt": "Adicionar aos favoritos",
  "fr": "Ajouter aux favoris",
  "uk": "Додати до вибраного"
 },
 "Remove from Favorites": {
  "tr": "Favorilerden kaldır",
  "es": "Quitar de favoritos",
  "pt": "Remover dos favoritos",
  "fr": "Retirer des favoris",
  "uk": "Видалити з вибраного"
 },
 "Edit bookmark…": {
  "tr": "Yer imini düzenle…",
  "es": "Editar marcador…",
  "pt": "Editar marcador…",
  "fr": "Modifier le signet…",
  "uk": "Редагувати закладку…"
 },
 "Move to folder": {
  "tr": "Klasöre taşı",
  "es": "Mover a carpeta",
  "pt": "Mover para pasta",
  "fr": "Déplacer vers le dossier",
  "uk": "Перемістити до папки"
 },
 "Remove bookmark": {
  "tr": "Yer imini kaldır",
  "es": "Quitar marcador",
  "pt": "Remover marcador",
  "fr": "Supprimer le signet",
  "uk": "Видалити закладку"
 },
 "Close all tabs": {
  "tr": "Tüm sekmeleri kapat",
  "es": "Cerrar todas las pestañas",
  "pt": "Fechar todos os separadores",
  "fr": "Fermer tous les onglets",
  "uk": "Закрити всі вкладки"
 },
 "Trackpad gestures": {
  "tr": "Trackpad hareketleri",
  "es": "Gestos del trackpad",
  "pt": "Gestos do trackpad",
  "fr": "Gestes du trackpad",
  "uk": "Жести трекпада"
 },
 "Swipe between pages and spaces. Pinch to zoom.": {
  "tr": "Sayfalar ve alanlar arasında kaydırın. Yakınlaştırmak için kıstırın.",
  "es": "Desliza entre páginas y espacios. Pellizca para ampliar.",
  "pt": "Deslize entre páginas e espaços. Junte os dedos para ampliar.",
  "fr": "Balayez entre les pages et les espaces. Pincez pour zoomer.",
  "uk": "Гортайте між сторінками й просторами. Зведіть пальці, щоб масштабувати."
 },
 "Passkeys": {
  "tr": "Geçiş anahtarları",
  "es": "Llaves de acceso",
  "pt": "Chaves-senha",
  "fr": "Clés d’accès",
  "uk": "Ключі доступу"
 },
 "Saved in Prism and unlocked with Touch ID.": {
  "tr": "Prism’de saklanır, Touch ID ile açılır.",
  "es": "Guardadas en Prism y desbloqueadas con Touch ID.",
  "pt": "Guardadas no Prism e desbloqueadas com Touch ID.",
  "fr": "Enregistrées dans Prism et déverrouillées avec Touch ID.",
  "uk": "Зберігаються в Prism і відкриваються через Touch ID."
 },
 "No passkeys yet.": {
  "tr": "Henüz geçiş anahtarı yok.",
  "es": "Aún no hay llaves de acceso.",
  "pt": "Ainda não há chaves-senha.",
  "fr": "Aucune clé d’accès pour l’instant.",
  "uk": "Ключів доступу ще немає."
 },
 "Remove this passkey?": {
  "tr": "Bu geçiş anahtarı kaldırılsın mı?",
  "es": "¿Quitar esta llave de acceso?",
  "pt": "Remover esta chave-senha?",
  "fr": "Supprimer cette clé d’accès ?",
  "uk": "Видалити цей ключ доступу?"
 },
 "Site settings": {
  "tr": "Site ayarları",
  "es": "Ajustes del sitio",
  "pt": "Definições do site",
  "fr": "Réglages du site",
  "uk": "Налаштування сайту"
 },
 "Site settings are unavailable here.": {
  "tr": "Site ayarları burada kullanılamaz.",
  "es": "Los ajustes del sitio no están disponibles aquí.",
  "pt": "As definições do site não estão disponíveis aqui.",
  "fr": "Réglages du site indisponibles ici.",
  "uk": "Налаштування сайту тут недоступні."
 },
 "Allow": {
  "tr": "İzin ver",
  "es": "Permitir",
  "pt": "Permitir",
  "fr": "Autoriser",
  "uk": "Дозволити"
 },
 "Ask": {
  "tr": "Sor",
  "es": "Preguntar",
  "pt": "Perguntar",
  "fr": "Demander",
  "uk": "Питати"
 },
 "Block": {
  "tr": "Engelle",
  "es": "Bloquear",
  "pt": "Bloquear",
  "fr": "Bloquer",
  "uk": "Блокувати"
 },
 "Zoom": {
  "tr": "Yakınlaştırma",
  "es": "Zoom",
  "pt": "Zoom",
  "fr": "Zoom",
  "uk": "Масштаб"
 },
 "Reset zoom": {
  "tr": "Yakınlaştırmayı sıfırla",
  "es": "Restablecer zoom",
  "pt": "Repor zoom",
  "fr": "Réinitialiser le zoom",
  "uk": "Скинути масштаб"
 },
 "Cookies and site data": {
  "tr": "Çerezler ve site verileri",
  "es": "Cookies y datos del sitio",
  "pt": "Cookies e dados do site",
  "fr": "Cookies et données du site",
  "uk": "Cookie та дані сайту"
 },
 "Cache": {
  "tr": "Önbellek",
  "es": "Caché",
  "pt": "Cache",
  "fr": "Cache",
  "uk": "Кеш"
 },
 "Hidden elements": {
  "tr": "Gizlenen öğeler",
  "es": "Elementos ocultos",
  "pt": "Elementos ocultos",
  "fr": "Éléments masqués",
  "uk": "Приховані елементи"
 },
 "Restore": {
  "tr": "Geri yükle",
  "es": "Restaurar",
  "pt": "Repor",
  "fr": "Restaurer",
  "uk": "Відновити"
 },
 "Erase elements": {
  "tr": "Öğeleri sil",
  "es": "Borrar elementos",
  "pt": "Apagar elementos",
  "fr": "Effacer des éléments",
  "uk": "Стерти елементи"
 },
 "Reset permissions": {
  "tr": "İzinleri sıfırla",
  "es": "Restablecer permisos",
  "pt": "Repor permissões",
  "fr": "Réinitialiser les autorisations",
  "uk": "Скинути дозволи"
 },
 "Clear cookies and data for {site}?": {
  "tr": "{site} için çerezler ve veriler temizlensin mi?",
  "es": "¿Borrar cookies y datos de {site}?",
  "pt": "Limpar cookies e dados de {site}?",
  "fr": "Effacer les cookies et données de {site} ?",
  "uk": "Очистити cookie та дані для {site}?"
 },
 "Cache cleared": {
  "tr": "Önbellek temizlendi",
  "es": "Caché borrada",
  "pt": "Cache limpa",
  "fr": "Cache effacé",
  "uk": "Кеш очищено"
 },
 "Click to hide · ⌥-click hides all similar · Esc when done": {
  "tr": "Gizlemek için tıkla · benzerlerin hepsi için ⌥-tıkla · bitince Esc",
  "es": "Clic para ocultar · ⌥-clic oculta los similares · Esc al terminar",
  "pt": "Clique para ocultar · ⌥-clique oculta os semelhantes · Esc para terminar",
  "fr": "Clic pour masquer · ⌥-clic masque les similaires · Échap pour finir",
  "uk": "Клацніть, щоб приховати · ⌥-клацання ховає подібні · Esc — готово"
 },
 "{n} similar": {
  "tr": "{n} benzer",
  "es": "{n} similares",
  "pt": "{n} semelhantes",
  "fr": "{n} similaires",
  "uk": "{n} подібних"
 },
 "hide all {n}": {
  "tr": "{n} öğenin hepsini gizle",
  "es": "ocultar los {n}",
  "pt": "ocultar os {n}",
  "fr": "tout masquer ({n})",
  "uk": "приховати всі {n}"
 },
 "Picture in Picture": {
  "tr": "Resim İçinde Resim",
  "es": "Imagen dentro de imagen",
  "pt": "Imagem na imagem",
  "fr": "Image dans l’image",
  "uk": "Картинка в картинці"
 },
 "Organize tabs by site": {
  "tr": "Sekmeleri siteye göre düzenle",
  "es": "Organizar pestañas por sitio",
  "pt": "Organizar separadores por site",
  "fr": "Organiser les onglets par site",
  "uk": "Упорядкувати вкладки за сайтом"
 },
 "Tab name": {
  "tr": "Sekme adı",
  "es": "Nombre de la pestaña",
  "pt": "Nome do separador",
  "fr": "Nom de l’onglet",
  "uk": "Назва вкладки"
 },
 "Undo": {
  "tr": "Geri al",
  "es": "Deshacer",
  "pt": "Anular",
  "fr": "Annuler",
  "uk": "Скасувати"
 },
 "{n} tabs closed": {
  "tr": "{n} sekme kapatıldı",
  "es": "{n} pestañas cerradas",
  "pt": "{n} separadores fechados",
  "fr": "{n} onglets fermés",
  "uk": "Закрито вкладок: {n}"
 },
 "Tabs organized by site": {
  "tr": "Sekmeler siteye göre düzenlendi",
  "es": "Pestañas organizadas por sitio",
  "pt": "Separadores organizados por site",
  "fr": "Onglets organisés par site",
  "uk": "Вкладки впорядковано за сайтом"
 },
 "Folder removed": {
  "tr": "Klasör kaldırıldı",
  "es": "Carpeta quitada",
  "pt": "Pasta removida",
  "fr": "Dossier supprimé",
  "uk": "Папку видалено"
 },
 "Folder deleted": {
  "tr": "Klasör silindi",
  "es": "Carpeta eliminada",
  "pt": "Pasta eliminada",
  "fr": "Dossier et signets supprimés",
  "uk": "Папку й закладки видалено"
 },
 "Tab duplicated": {
  "tr": "Sekme çoğaltıldı",
  "es": "Pestaña duplicada",
  "pt": "Separador duplicado",
  "fr": "Onglet dupliqué",
  "uk": "Вкладку продубльовано"
 },
 "Added to {folder}": {
  "tr": "{folder} klasörüne eklendi",
  "es": "Añadido a {folder}",
  "pt": "Adicionado a {folder}",
  "fr": "Ajouté à {folder}",
  "uk": "Додано до {folder}"
 },
 "Password copied": {
  "tr": "Parola kopyalandı",
  "es": "Contraseña copiada",
  "pt": "Palavra-passe copiada",
  "fr": "Mot de passe copié",
  "uk": "Пароль скопійовано"
 },
 "Username copied": {
  "tr": "Kullanıcı adı kopyalandı",
  "es": "Usuario copiado",
  "pt": "Nome de utilizador copiado",
  "fr": "Nom d’utilisateur copié",
  "uk": "Ім’я користувача скопійовано"
 },
 "active": {
  "tr": "etkin",
  "es": "activas",
  "pt": "ativas",
  "fr": "actifs",
  "uk": "активні"
 },
 "new": {
  "tr": "yeni",
  "es": "nuevas",
  "pt": "novas",
  "fr": "nouveaux",
  "uk": "нові"
 },
 "Recent": {
  "tr": "Son indirilenler",
  "es": "Recientes",
  "pt": "Recentes",
  "fr": "Récents",
  "uk": "Нещодавні"
 },
 "Downloading": {
  "tr": "İndiriliyor",
  "es": "Descargando",
  "pt": "A transferir",
  "fr": "Téléchargement",
  "uk": "Завантаження"
 },
 "Paused": {
  "tr": "Duraklatıldı",
  "es": "En pausa",
  "pt": "Em pausa",
  "fr": "En pause",
  "uk": "Призупинено"
 },
 "Completed": {
  "tr": "Tamamlandı",
  "es": "Completada",
  "pt": "Concluída",
  "fr": "Terminé",
  "uk": "Завершено"
 },
 "Canceled": {
  "tr": "İptal edildi",
  "es": "Cancelada",
  "pt": "Cancelada",
  "fr": "Annulé",
  "uk": "Скасовано"
 },
 "Failed": {
  "tr": "Başarısız",
  "es": "Falló",
  "pt": "Falhou",
  "fr": "Échec",
  "uk": "Помилка"
 },
 "download progress": {
  "tr": "indirme ilerlemesi",
  "es": "progreso de la descarga",
  "pt": "progresso da transferência",
  "fr": "progression du téléchargement",
  "uk": "перебіг завантаження"
 },
 "Add login": {
  "tr": "Giriş ekle",
  "es": "Añadir inicio de sesión",
  "pt": "Adicionar início de sessão",
  "fr": "Ajouter un identifiant",
  "uk": "Додати дані входу"
 },
 "Edit login": {
  "tr": "Girişi düzenle",
  "es": "Editar inicio de sesión",
  "pt": "Editar início de sessão",
  "fr": "Modifier l’identifiant",
  "uk": "Редагувати дані входу"
 },
 "Save login": {
  "tr": "Girişi kaydet",
  "es": "Guardar inicio de sesión",
  "pt": "Guardar início de sessão",
  "fr": "Enregistrer l’identifiant",
  "uk": "Зберегти дані входу"
 },
 "Save changes": {
  "tr": "Değişiklikleri kaydet",
  "es": "Guardar cambios",
  "pt": "Guardar alterações",
  "fr": "Enregistrer les modifications",
  "uk": "Зберегти зміни"
 },
 "Password": {
  "tr": "Parola",
  "es": "Contraseña",
  "pt": "Palavra-passe",
  "fr": "Mot de passe",
  "uk": "Пароль"
 },
 "Leave unchanged": {
  "tr": "Değiştirmeden bırak",
  "es": "Dejar sin cambios",
  "pt": "Manter inalterada",
  "fr": "Laisser inchangé",
  "uk": "Залишити без змін"
 },
 "No saved logins yet": {
  "tr": "Henüz kayıtlı giriş yok",
  "es": "Aún no hay inicios de sesión guardados",
  "pt": "Ainda não há inícios de sessão guardados",
  "fr": "Aucun identifiant enregistré",
  "uk": "Ще немає збережених даних входу"
 },
 "Prism offers to save a login when you sign in, or add one yourself.": {
  "tr": "Prism, oturum açtığında girişi kaydetmeyi önerir; istersen kendin de ekleyebilirsin.",
  "es": "Prism ofrece guardar un inicio de sesión cuando inicias sesión, o puedes añadir uno tú.",
  "pt": "O Prism oferece guardar o início de sessão quando inicia sessão, ou pode adicionar um.",
  "fr": "Prism propose d’enregistrer l’identifiant quand vous vous connectez, ou ajoutez-en un vous-même.",
  "uk": "Prism пропонує зберегти дані під час входу, або додайте їх самостійно."
 },
 "Copy username": {
  "tr": "Kullanıcı adını kopyala",
  "es": "Copiar usuario",
  "pt": "Copiar nome de utilizador",
  "fr": "Copier le nom d’utilisateur",
  "uk": "Копіювати ім’я користувача"
 },
 "Copy password": {
  "tr": "Parolayı kopyala",
  "es": "Copiar contraseña",
  "pt": "Copiar palavra-passe",
  "fr": "Copier le mot de passe",
  "uk": "Копіювати пароль"
 },
 "Account without a username": {
  "tr": "Kullanıcı adı olmayan hesap",
  "es": "Cuenta sin nombre de usuario",
  "pt": "Conta sem nome de utilizador",
  "fr": "Compte sans nom d’utilisateur",
  "uk": "Обліковий запис без імені користувача"
 },
 "Search extensions": {
  "tr": "Uzantılarda ara",
  "es": "Buscar extensiones",
  "pt": "Pesquisar extensões",
  "fr": "Rechercher des extensions",
  "uk": "Пошук розширень"
 },
 "How extensions work in Prism": {
  "tr": "Uzantılar Prism’de nasıl çalışır",
  "es": "Cómo funcionan las extensiones en Prism",
  "pt": "Como funcionam as extensões no Prism",
  "fr": "Fonctionnement des extensions dans Prism",
  "uk": "Як працюють розширення в Prism"
 },
 "Version": {
  "tr": "Sürüm",
  "es": "Versión",
  "pt": "Versão",
  "fr": "Version",
  "uk": "Версія"
 },
 "On": {
  "tr": "Açık",
  "es": "Activada",
  "pt": "Ativada",
  "fr": "Activée",
  "uk": "Увімкнено"
 },
 "Off": {
  "tr": "Kapalı",
  "es": "Desactivada",
  "pt": "Desativada",
  "fr": "Désactivée",
  "uk": "Вимкнено"
 },
 "Could not load": {
  "tr": "Yüklenemedi",
  "es": "No se pudo cargar",
  "pt": "Não foi possível carregar",
  "fr": "Chargement impossible",
  "uk": "Не вдалося завантажити"
 },
 "Turn off": {
  "tr": "Kapat",
  "es": "Desactivar",
  "pt": "Desativar",
  "fr": "Désactiver",
  "uk": "Вимкнути"
 },
 "Turn on": {
  "tr": "Aç",
  "es": "Activar",
  "pt": "Ativar",
  "fr": "Activer",
  "uk": "Увімкнути"
 },
 "No matching extensions": {
  "tr": "Eşleşen uzantı yok",
  "es": "No hay extensiones coincidentes",
  "pt": "Nenhuma extensão correspondente",
  "fr": "Aucune extension correspondante",
  "uk": "Розширень не знайдено"
 },
 "Use a saved password?": {
  "tr": "Kayıtlı parola kullanılsın mı?",
  "es": "¿Usar una contraseña guardada?",
  "pt": "Usar uma palavra-passe guardada?",
  "fr": "Utiliser un mot de passe enregistré ?",
  "uk": "Використати збережений пароль?"
 },
 "This Mac has no Touch ID. Make sure nobody else can see your screen.": {
  "tr": "Bu Mac’te Touch ID yok. Ekranını başka kimsenin görmediğinden emin ol.",
  "es": "Este Mac no tiene Touch ID. Asegúrate de que nadie más vea tu pantalla.",
  "pt": "Este Mac não tem Touch ID. Certifique-se de que mais ninguém vê o ecrã.",
  "fr": "Ce Mac n’a pas Touch ID. Assurez-vous que personne d’autre ne voit votre écran.",
  "uk": "На цьому Mac немає Touch ID. Переконайтеся, що ніхто інший не бачить ваш екран."
 },
 "Password not shown.": {
  "tr": "Parola gösterilmedi.",
  "es": "No se mostró la contraseña.",
  "pt": "A palavra-passe não foi mostrada.",
  "fr": "Mot de passe non affiché.",
  "uk": "Пароль не показано."
 },
 "Password not copied.": {
  "tr": "Parola kopyalanmadı.",
  "es": "No se copió la contraseña.",
  "pt": "A palavra-passe não foi copiada.",
  "fr": "Mot de passe non copié.",
  "uk": "Пароль не скопійовано."
 },
 "Login saved.": {
  "tr": "Giriş kaydedildi.",
  "es": "Inicio de sesión guardado.",
  "pt": "Início de sessão guardado.",
  "fr": "Identifiant enregistré.",
  "uk": "Дані входу збережено."
 },
 "Nothing downloaded yet": {
  "tr": "Henüz bir şey indirilmedi",
  "es": "Aún no hay descargas",
  "pt": "Ainda não há transferências",
  "fr": "Aucun téléchargement",
  "uk": "Ще нічого не завантажено"
 },
 "New downloads will appear here.": {
  "tr": "Yeni indirilenler burada görünür.",
  "es": "Las descargas nuevas aparecerán aquí.",
  "pt": "As novas transferências aparecem aqui.",
  "fr": "Les nouveaux téléchargements apparaîtront ici.",
  "uk": "Нові завантаження з’являться тут."
 },
 "Camera": {
  "tr": "Kamera",
  "es": "Cámara",
  "pt": "Câmara",
  "fr": "Caméra",
  "uk": "Камера"
 },
 "Microphone": {
  "tr": "Mikrofon",
  "es": "Micrófono",
  "pt": "Microfone",
  "fr": "Micro",
  "uk": "Мікрофон"
 },
 "Notifications": {
  "tr": "Bildirimler",
  "es": "Notificaciones",
  "pt": "Notificações",
  "fr": "Notifications",
  "uk": "Сповіщення"
 },
 "Location": {
  "tr": "Konum",
  "es": "Ubicación",
  "pt": "Localização",
  "fr": "Position",
  "uk": "Розташування"
 },
 "Clipboard": {
  "tr": "Pano",
  "es": "Portapapeles",
  "pt": "Área de transferência",
  "fr": "Presse-papiers",
  "uk": "Буфер обміну"
 },
 "Allowed": {
  "tr": "İzin verildi",
  "es": "Permitido",
  "pt": "Permitido",
  "fr": "Autorisé",
  "uk": "Дозволено"
 },
 "Blocked": {
  "tr": "Engellendi",
  "es": "Bloqueado",
  "pt": "Bloqueado",
  "fr": "Bloqué",
  "uk": "Заблоковано"
 },
 "No extension panels": {
  "tr": "Uzantı paneli yok",
  "es": "No hay paneles de extensiones",
  "pt": "Sem painéis de extensões",
  "fr": "Aucun panneau d’extension",
  "uk": "Немає панелей розширень"
 },
 "Extensions with their own panel appear here.": {
  "tr": "Kendi paneli olan uzantılar burada görünür.",
  "es": "Aquí aparecen las extensiones con panel propio.",
  "pt": "As extensões com painel próprio aparecem aqui.",
  "fr": "Les extensions avec leur propre panneau apparaissent ici.",
  "uk": "Тут з’являються розширення з власною панеллю."
 },
 "Spaces": {
  "tr": "Alanlar",
  "es": "Espacios",
  "pt": "Espaços",
  "fr": "Espaces",
  "uk": "Простори"
 },
 "Customize space": {
  "tr": "Alanı özelleştir",
  "es": "Personalizar espacio",
  "pt": "Personalizar espaço",
  "fr": "Personnaliser l’espace",
  "uk": "Налаштувати простір"
 },
 "New space": {
  "tr": "Yeni alan",
  "es": "Nuevo espacio",
  "pt": "Novo espaço",
  "fr": "Nouvel espace",
  "uk": "Новий простір"
 },
 "{count} of 40 spaces": {
  "tr": "{count}/40 alan",
  "es": "{count} de 40 espacios",
  "pt": "{count} de 40 espaços",
  "fr": "{count} sur 40 espaces",
  "uk": "{count} з 40 просторів"
 },
 "Space name": {
  "tr": "Alan adı",
  "es": "Nombre del espacio",
  "pt": "Nome do espaço",
  "fr": "Nom de l’espace",
  "uk": "Назва простору"
 },
 "Icon": {
  "tr": "Simge",
  "es": "Icono",
  "pt": "Ícone",
  "fr": "Icône",
  "uk": "Значок"
 },
 "Color": {
  "tr": "Renk",
  "es": "Color",
  "pt": "Cor",
  "fr": "Couleur",
  "uk": "Колір"
 },
 "Theme": {
  "tr": "Tema",
  "es": "Tema",
  "pt": "Tema",
  "fr": "Thème",
  "uk": "Тема"
 },
 "Custom": {
  "tr": "Özel",
  "es": "Personalizado",
  "pt": "Personalizado",
  "fr": "Personnalisé",
  "uk": "Власний"
 },
 "Custom color": {
  "tr": "Özel renk",
  "es": "Color personalizado",
  "pt": "Cor personalizada",
  "fr": "Couleur personnalisée",
  "uk": "Власний колір"
 },
 "Hex color": {
  "tr": "Hex renk",
  "es": "Color hex",
  "pt": "Cor hex",
  "fr": "Couleur hex",
  "uk": "Колір hex"
 },
 "Delete space": {
  "tr": "Alanı sil",
  "es": "Eliminar espacio",
  "pt": "Eliminar espaço",
  "fr": "Supprimer l’espace",
  "uk": "Видалити простір"
 },
 "Create space": {
  "tr": "Alan oluştur",
  "es": "Crear espacio",
  "pt": "Criar espaço",
  "fr": "Créer l’espace",
  "uk": "Створити простір"
 },
 "Delete this space?": {
  "tr": "Bu alan silinsin mi?",
  "es": "¿Eliminar este espacio?",
  "pt": "Eliminar este espaço?",
  "fr": "Supprimer cet espace ?",
  "uk": "Видалити цей простір?"
 },
 "Its open tabs will close.": {
  "tr": "Açık sekmeleri kapanacak.",
  "es": "Sus pestañas abiertas se cerrarán.",
  "pt": "Os separadores abertos serão fechados.",
  "fr": "Ses onglets ouverts seront fermés.",
  "uk": "Його відкриті вкладки закриються."
 },
 "Keep at least one space.": {
  "tr": "En az bir alan kalmalı.",
  "es": "Debe quedar al menos un espacio.",
  "pt": "Mantenha pelo menos um espaço.",
  "fr": "Gardez au moins un espace.",
  "uk": "Залиште принаймні один простір."
 },
 "Find a space": {
  "tr": "Alan bul",
  "es": "Buscar un espacio",
  "pt": "Procurar um espaço",
  "fr": "Rechercher un espace",
  "uk": "Знайти простір"
 },
 "No matching spaces": {
  "tr": "Eşleşen alan yok",
  "es": "No hay espacios que coincidan",
  "pt": "Nenhum espaço corresponde",
  "fr": "Aucun espace correspondant",
  "uk": "Немає відповідних просторів"
 },
 "No tabs": {
  "tr": "Sekme yok",
  "es": "Sin pestañas",
  "pt": "Sem separadores",
  "fr": "Aucun onglet",
  "uk": "Немає вкладок"
 },
 "1 tab": {
  "tr": "1 sekme",
  "es": "1 pestaña",
  "pt": "1 separador",
  "fr": "1 onglet",
  "uk": "1 вкладка"
 },
 "{count} tabs": {
  "tr": "{count} sekme",
  "es": "{count} pestañas",
  "pt": "{count} separadores",
  "fr": "{count} onglets",
  "uk": "Вкладок: {count}"
 },
 "It has no open tabs.": {
  "tr": "Açık sekmesi yok.",
  "es": "No tiene pestañas abiertas.",
  "pt": "Não tem separadores abertos.",
  "fr": "Il n’a aucun onglet ouvert.",
  "uk": "У ньому немає відкритих вкладок."
 },
 "Show all spaces": {
  "tr": "Tüm alanları göster",
  "es": "Mostrar todos los espacios",
  "pt": "Mostrar todos os espaços",
  "fr": "Afficher tous les espaces",
  "uk": "Показати всі простори"
 },
 "You can have up to 40 spaces.": {
  "tr": "En fazla 40 alanınız olabilir.",
  "es": "Puedes tener hasta 40 espacios.",
  "pt": "Pode ter até 40 espaços.",
  "fr": "Vous pouvez avoir jusqu’à 40 espaces.",
  "uk": "Можна мати до 40 просторів."
 }
};
const languages=["en","tr","es","pt","fr","uk"];
function translate(language,text){return catalog[text]?.[language]||text;}
const api={catalog,languages,translate};if(typeof module!=="undefined"&&module.exports)module.exports=api;else root.PrismLanguages=api;
})(globalThis);
