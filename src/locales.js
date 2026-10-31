(function(root){
const catalog={
 "Help": {
  "tr": "Yardım",
  "es": "Ayuda",
  "pt": "Ajuda",
  "fr": "Aide",
  "uk": "Довідка"
 },
 "Show All History": {
  "tr": "Tüm geçmişi göster",
  "es": "Mostrar todo el historial",
  "pt": "Mostrar todo o histórico",
  "fr": "Afficher tout l’historique",
  "uk": "Показати всю історію"
 },
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
  "es": "Navegando",
  "pt": "A navegar",
  "fr": "Navigation",
  "uk": "Перегляд вебу"
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
 },
 "Keep it above the page, or in the sidebar where New tab is.": {
  "tr": "Sayfanın üstünde ya da kenar çubuğunda, Yeni sekme’nin olduğu yerde tutun.",
  "es": "Mantenla sobre la página o en la barra lateral, donde está Nueva pestaña.",
  "pt": "Mantenha-a acima da página ou na barra lateral, onde está Novo separador.",
  "fr": "Gardez-la au-dessus de la page ou dans la barre latérale, à la place de Nouvel onglet.",
  "uk": "Тримайте її над сторінкою або на бічній панелі, де «Нова вкладка»."
 },
 "Above the page": {
  "tr": "Sayfanın üstünde",
  "es": "Sobre la página",
  "pt": "Acima da página",
  "fr": "Au-dessus de la page",
  "uk": "Над сторінкою"
 },
 "In the sidebar": {
  "tr": "Kenar çubuğunda",
  "es": "En la barra lateral",
  "pt": "Na barra lateral",
  "fr": "Dans la barre latérale",
  "uk": "На бічній панелі"
 },
 "Archive idle tabs after": {
  "tr": "Boştaki sekmeleri arşivle",
  "es": "Archivar pestañas inactivas tras",
  "pt": "Arquivar separadores inativos após",
  "fr": "Archiver les onglets inactifs après",
  "uk": "Архівувати неактивні вкладки через"
 },
 "Sleeping tabs you haven’t opened move to Archived under your tabs. Pinned tabs and favorites stay.": {
  "tr": "Açmadığınız uyuyan sekmeler, sekmelerinizin altındaki Arşivlendi bölümüne taşınır. Sabitlenmiş sekmeler ve favoriler kalır.",
  "es": "Las pestañas dormidas que no has abierto pasan a Archivadas, bajo tus pestañas. Las fijadas y favoritas se quedan.",
  "pt": "Os separadores adormecidos que não abriu passam para Arquivados, sob os seus separadores. Os fixados e favoritos ficam.",
  "fr": "Les onglets en veille que vous n’avez pas ouverts passent dans Archivés, sous vos onglets. Les onglets épinglés et favoris restent.",
  "uk": "Сплячі вкладки, які ви не відкривали, переходять до «Архіву» під вкладками. Закріплені та улюблені залишаються."
 },
 "Never": {
  "tr": "Asla",
  "es": "Nunca",
  "pt": "Nunca",
  "fr": "Jamais",
  "uk": "Ніколи"
 },
 "12 hours": {
  "tr": "12 saat",
  "es": "12 horas",
  "pt": "12 horas",
  "fr": "12 heures",
  "uk": "12 годин"
 },
 "1 day": {
  "tr": "1 gün",
  "es": "1 día",
  "pt": "1 dia",
  "fr": "1 jour",
  "uk": "1 день"
 },
 "1 week": {
  "tr": "1 hafta",
  "es": "1 semana",
  "pt": "1 semana",
  "fr": "1 semaine",
  "uk": "1 тиждень"
 },
 "Picture in picture when you switch tabs": {
  "tr": "Sekme değiştirince resim içinde resim",
  "es": "Imagen en imagen al cambiar de pestaña",
  "pt": "Imagem na imagem ao mudar de separador",
  "fr": "Image dans l’image en changeant d’onglet",
  "uk": "Картинка в картинці під час перемикання вкладок"
 },
 "A playing video floats in a small window when you leave its tab, and returns when you come back.": {
  "tr": "Oynayan bir video, sekmesinden ayrılınca küçük bir pencerede süzülür ve geri döndüğünüzde yerine gelir.",
  "es": "Un vídeo en reproducción flota en una ventana pequeña al salir de su pestaña y vuelve cuando regresas.",
  "pt": "Um vídeo a reproduzir flutua numa pequena janela quando sai do separador e volta quando regressa.",
  "fr": "Une vidéo en lecture flotte dans une petite fenêtre quand vous quittez son onglet, et revient à votre retour.",
  "uk": "Відео, що грає, плаває в маленькому вікні, коли ви залишаєте його вкладку, і повертається, коли ви повертаєтеся."
 },
 "New tab (⌘T)": {
  "tr": "Yeni sekme (⌘T)",
  "es": "Nueva pestaña (⌘T)",
  "pt": "Novo separador (⌘T)",
  "fr": "Nouvel onglet (⌘T)",
  "uk": "Нова вкладка (⌘T)"
 },
 "Page tools": {
  "tr": "Sayfa araçları",
  "es": "Herramientas de página",
  "pt": "Ferramentas da página",
  "fr": "Outils de la page",
  "uk": "Інструменти сторінки"
 },
 "Archived": {
  "tr": "Arşivlendi",
  "es": "Archivadas",
  "pt": "Arquivados",
  "fr": "Archivés",
  "uk": "Архів"
 },
 "Remove from archive": {
  "tr": "Arşivden kaldır",
  "es": "Quitar del archivo",
  "pt": "Remover do arquivo",
  "fr": "Retirer des archives",
  "uk": "Вилучити з архіву"
 },
 "Clear archive": {
  "tr": "Arşivi temizle",
  "es": "Vaciar archivo",
  "pt": "Limpar arquivo",
  "fr": "Vider les archives",
  "uk": "Очистити архів"
 },
 "Just now": {
  "tr": "Az önce",
  "es": "Ahora mismo",
  "pt": "Agora mesmo",
  "fr": "À l’instant",
  "uk": "Щойно"
 },
 "{n} min ago": {
  "tr": "{n} dk önce",
  "es": "hace {n} min",
  "pt": "há {n} min",
  "fr": "il y a {n} min",
  "uk": "{n} хв тому"
 },
 "{n} h ago": {
  "tr": "{n} sa önce",
  "es": "hace {n} h",
  "pt": "há {n} h",
  "fr": "il y a {n} h",
  "uk": "{n} год тому"
 },
 "{n} days ago": {
  "tr": "{n} gün önce",
  "es": "hace {n} días",
  "pt": "há {n} dias",
  "fr": "il y a {n} jours",
  "uk": "{n} дн. тому"
 },
 "Away": {
  "tr": "Uzakta",
  "es": "Fuera",
  "pt": "Ausente",
  "fr": "Absent",
  "uk": "Відсутні"
 },
 "Your tabs at {time}": {
  "tr": "{time} itibarıyla sekmeleriniz",
  "es": "Tus pestañas a las {time}",
  "pt": "Os seus separadores às {time}",
  "fr": "Vos onglets à {time}",
  "uk": "Ваші вкладки о {time}"
 },
 "and {count} more": {
  "tr": "ve {count} tane daha",
  "es": "y {count} más",
  "pt": "e mais {count}",
  "fr": "et {count} de plus",
  "uk": "і ще {count}"
 },
 "Bring them back": {
  "tr": "Geri getir",
  "es": "Recuperarlas",
  "pt": "Recuperá-los",
  "fr": "Les rouvrir",
  "uk": "Повернути їх"
 },
 "Show tab": {
  "tr": "Sekmeyi göster",
  "es": "Mostrar pestaña",
  "pt": "Mostrar separador",
  "fr": "Afficher l’onglet",
  "uk": "Показати вкладку"
 },
 "Play": {
  "tr": "Oynat",
  "es": "Reproducir",
  "pt": "Reproduzir",
  "fr": "Lire",
  "uk": "Відтворити"
 },
 "Back 10 seconds": {
  "tr": "10 saniye geri",
  "es": "Retroceder 10 segundos",
  "pt": "Recuar 10 segundos",
  "fr": "Reculer de 10 secondes",
  "uk": "Назад на 10 секунд"
 },
 "Forward 10 seconds": {
  "tr": "10 saniye ileri",
  "es": "Avanzar 10 segundos",
  "pt": "Avançar 10 segundos",
  "fr": "Avancer de 10 secondes",
  "uk": "Вперед на 10 секунд"
 },
 "Playing in Picture in Picture": {
  "tr": "Resim içinde resimde oynatılıyor",
  "es": "Reproduciendo en imagen en imagen",
  "pt": "A reproduzir em imagem na imagem",
  "fr": "Lecture en image dans l’image",
  "uk": "Відтворюється в режимі «картинка в картинці»"
 },
 "Bring the video back": {
  "tr": "Videoyu geri getir",
  "es": "Recuperar el vídeo",
  "pt": "Recuperar o vídeo",
  "fr": "Ramener la vidéo",
  "uk": "Повернути відео"
 },
 "Open as tab": {
  "tr": "Sekme olarak aç",
  "es": "Abrir como pestaña",
  "pt": "Abrir como separador",
  "fr": "Ouvrir dans un onglet",
  "uk": "Відкрити як вкладку"
 },
 "Close": {
  "tr": "Kapat",
  "es": "Cerrar",
  "pt": "Fechar",
  "fr": "Fermer",
  "uk": "Закрити"
 },
 "Search tabs, bookmarks, history or actions": {
  "tr": "Sekmelerde, yer imlerinde, geçmişte veya eylemlerde ara",
  "es": "Busca pestañas, marcadores, historial o acciones",
  "pt": "Pesquise separadores, marcadores, histórico ou ações",
  "fr": "Rechercher des onglets, signets, l’historique ou des actions",
  "uk": "Шукайте вкладки, закладки, історію або дії"
 },
 "Switch to tab": {
  "tr": "Sekmeye geç",
  "es": "Ir a la pestaña",
  "pt": "Ir para o separador",
  "fr": "Aller à l’onglet",
  "uk": "Перейти до вкладки"
 },
 "Favorite": {
  "tr": "Favori",
  "es": "Favorito",
  "pt": "Favorito",
  "fr": "Favori",
  "uk": "Улюблене"
 },
 "Bookmark": {
  "tr": "Yer imi",
  "es": "Marcador",
  "pt": "Marcador",
  "fr": "Signet",
  "uk": "Закладка"
 },
 "Action": {
  "tr": "Eylem",
  "es": "Acción",
  "pt": "Ação",
  "fr": "Action",
  "uk": "Дія"
 },
 "Show sidebar": {
  "tr": "Kenar çubuğunu göster",
  "es": "Mostrar barra lateral",
  "pt": "Mostrar barra lateral",
  "fr": "Afficher la barre latérale",
  "uk": "Показати бічну панель"
 },
 "Hide sidebar": {
  "tr": "Kenar çubuğunu gizle",
  "es": "Ocultar barra lateral",
  "pt": "Ocultar barra lateral",
  "fr": "Masquer la barre latérale",
  "uk": "Сховати бічну панель"
 },
 "Move address bar above the page": {
  "tr": "Adres çubuğunu sayfanın üstüne taşı",
  "es": "Mover la barra de direcciones sobre la página",
  "pt": "Mover a barra de endereço para cima da página",
  "fr": "Placer la barre d’adresse au-dessus de la page",
  "uk": "Перемістити адресний рядок над сторінку"
 },
 "Move address bar to the sidebar": {
  "tr": "Adres çubuğunu kenar çubuğuna taşı",
  "es": "Mover la barra de direcciones a la barra lateral",
  "pt": "Mover a barra de endereço para a barra lateral",
  "fr": "Placer la barre d’adresse dans la barre latérale",
  "uk": "Перемістити адресний рядок на бічну панель"
 },
 "Copy page link": {
  "tr": "Sayfa bağlantısını kopyala",
  "es": "Copiar enlace de la página",
  "pt": "Copiar ligação da página",
  "fr": "Copier le lien de la page",
  "uk": "Скопіювати посилання на сторінку"
 },
 "Split view": {
  "tr": "Bölünmüş görünüm",
  "es": "Vista dividida",
  "pt": "Vista dividida",
  "fr": "Vue partagée",
  "uk": "Розділений перегляд"
 },
 "Back to tab": {
  "tr": "Sekmeye dön",
  "es": "Volver a la pestaña",
  "pt": "Voltar ao separador",
  "fr": "Revenir à l’onglet",
  "uk": "Повернутися до вкладки"
 },
 "Mute": {
  "tr": "Sesi kapat",
  "es": "Silenciar",
  "pt": "Silenciar",
  "fr": "Couper le son",
  "uk": "Вимкнути звук"
 },
 "Unmute": {
  "tr": "Sesi aç",
  "es": "Activar sonido",
  "pt": "Ativar som",
  "fr": "Rétablir le son",
  "uk": "Увімкнути звук"
 },
 "Those tabs are already open.": {
  "tr": "Bu sekmeler zaten açık.",
  "es": "Esas pestañas ya están abiertas.",
  "pt": "Esses separadores já estão abertos.",
  "fr": "Ces onglets sont déjà ouverts.",
  "uk": "Ці вкладки вже відкриті."
 },
 "Private does not keep an archive.": {
  "tr": "Gizli, arşiv tutmaz.",
  "es": "Privado no guarda un archivo.",
  "pt": "O Privado não guarda arquivo.",
  "fr": "Le mode Privé ne conserve pas d’archives.",
  "uk": "Приватний режим не зберігає архів."
 },
 "Page tools are in Settings now": {
  "tr": "Sayfa araçları artık Ayarlar’da",
  "es": "Las herramientas de página están ahora en Ajustes",
  "pt": "As ferramentas da página estão agora nas Definições",
  "fr": "Les outils de la page sont maintenant dans Réglages",
  "uk": "Інструменти сторінки тепер у Налаштуваннях"
 },
 "Clear view": {
  "tr": "Berrak görünüm",
  "es": "Vista clara",
  "pt": "Vista limpa",
  "fr": "Vue épurée",
  "uk": "Чистий вигляд"
 },
 "Turn off Clear view": {
  "tr": "Berrak görünümü kapat",
  "es": "Desactivar Vista clara",
  "pt": "Desativar Vista limpa",
  "fr": "Désactiver la Vue épurée",
  "uk": "Вимкнути чистий вигляд"
 },
 "Turn on Clear view": {
  "tr": "Berrak görünümü aç",
  "es": "Activar Vista clara",
  "pt": "Ativar Vista limpa",
  "fr": "Activer la Vue épurée",
  "uk": "Увімкнути чистий вигляд"
 },
 "Beam": {
  "tr": "Işın",
  "es": "Haz",
  "pt": "Feixe",
  "fr": "Faisceau",
  "uk": "Промінь"
 },
 "Open Link in Lens": {
  "tr": "Bağlantıyı Mercek’te aç",
  "es": "Abrir enlace en Lente",
  "pt": "Abrir ligação na Lente",
  "fr": "Ouvrir le lien dans Lentille",
  "uk": "Відкрити посилання в Лінзі"
 },
 "Shield": {
  "tr": "Kalkan",
  "es": "Escudo",
  "pt": "Escudo",
  "fr": "Bouclier",
  "uk": "Щит"
 },
 "Prism Shield": {
  "tr": "Prism Kalkanı",
  "es": "Escudo de Prism",
  "pt": "Escudo do Prism",
  "fr": "Bouclier Prism",
  "uk": "Щит Prism"
 },
 "Turn on Shield": {
  "tr": "Kalkanı aç",
  "es": "Activar Escudo",
  "pt": "Ativar Escudo",
  "fr": "Activer le Bouclier",
  "uk": "Увімкнути Щит"
 },
 "Applies to every space, including Private.": {
  "tr": "Özel dahil her alanda geçerlidir.",
  "es": "Se aplica a todos los espacios, incluido Privado.",
  "pt": "Aplica-se a todos os espaços, incluindo Privado.",
  "fr": "S’applique à tous les espaces, y compris Privé.",
  "uk": "Діє в усіх просторах, зокрема в Приватному."
 },
 "Only the page: the sidebar and toolbar step aside until you move to the left edge (⌥⌘S).": {
  "tr": "Yalnızca sayfa: kenar çubuğu ve araç çubuğu, sol kenara gelene kadar çekilir (⌥⌘S).",
  "es": "Solo la página: la barra lateral y la de herramientas se apartan hasta que vas al borde izquierdo (⌥⌘S).",
  "pt": "Só a página: a barra lateral e a de ferramentas afastam-se até ir à margem esquerda (⌥⌘S).",
  "fr": "Seulement la page : la barre latérale et la barre d’outils s’effacent jusqu’à ce que vous alliez au bord gauche (⌥⌘S).",
  "uk": "Лише сторінка: бічна панель і панель інструментів ховаються, доки ви не наведете на лівий край (⌥⌘S)."
 },
 "Blocks ads, trackers, cookie banners and YouTube’s video ads, built into Prism with no extension running.": {
  "tr": "Reklamları, izleyicileri, çerez bildirimlerini ve YouTube video reklamlarını engeller; Prism’in içinde, hiçbir uzantı çalışmadan.",
  "es": "Bloquea anuncios, rastreadores, avisos de cookies y los anuncios en vídeo de YouTube, integrado en Prism sin extensiones.",
  "pt": "Bloqueia anúncios, rastreadores, avisos de cookies e os anúncios em vídeo do YouTube, integrado no Prism sem extensões.",
  "fr": "Bloque les publicités, les traqueurs, les bandeaux de cookies et les publicités vidéo de YouTube, intégré à Prism sans extension.",
  "uk": "Блокує рекламу, трекери, банери cookie та відеорекламу YouTube, вбудовано в Prism без розширень."
 },
 "Shield also removes tracking tags from links (like utm_ and fbclid), sends Global Privacy Control to sites, and swaps blocked analytics scripts for harmless stand-ins so pages keep working. If a site looks broken, pause Shield on it.": {
  "tr": "Kalkan ayrıca bağlantılardaki izleme etiketlerini (utm_ ve fbclid gibi) siler, sitelere Global Privacy Control gönderir ve sayfalar bozulmasın diye engellenen analiz betiklerinin yerine zararsız boş sürümler koyar. Bir site bozuk görünürse Kalkan’ı o sitede duraklatın.",
  "es": "El Escudo también quita las etiquetas de seguimiento de los enlaces (como utm_ y fbclid), envía Global Privacy Control a los sitios y cambia los scripts de analítica bloqueados por sustitutos inofensivos para que las páginas sigan funcionando. Si un sitio se ve roto, pausa el Escudo en él.",
  "pt": "O Escudo também remove etiquetas de rastreio das ligações (como utm_ e fbclid), envia Global Privacy Control aos sites e troca scripts de análise bloqueados por substitutos inofensivos para que as páginas continuem a funcionar. Se um site parecer avariado, pause o Escudo nele.",
  "fr": "Le Bouclier retire aussi les balises de suivi des liens (comme utm_ et fbclid), envoie Global Privacy Control aux sites et remplace les scripts d’analyse bloqués par des substituts inoffensifs pour que les pages fonctionnent. Si un site semble cassé, mettez le Bouclier en pause sur ce site.",
  "uk": "Щит також прибирає мітки відстеження з посилань (як-от utm_ і fbclid), надсилає сайтам Global Privacy Control і замінює заблоковані скрипти аналітики безпечними заглушками, щоб сторінки працювали. Якщо сайт виглядає зламаним, призупиніть Щит на ньому."
 },
 "{n} blocked on this page": {
  "tr": "Bu sayfada {n} engellendi",
  "es": "{n} bloqueados en esta página",
  "pt": "{n} bloqueados nesta página",
  "fr": "{n} bloqués sur cette page",
  "uk": "{n} заблоковано на цій сторінці"
 },
 "{n} blocked so far · {links} links cleaned": {
  "tr": "Şimdiye kadar {n} engellendi · {links} bağlantı temizlendi",
  "es": "{n} bloqueados hasta ahora · {links} enlaces limpiados",
  "pt": "{n} bloqueados até agora · {links} ligações limpas",
  "fr": "{n} bloqués jusqu’ici · {links} liens nettoyés",
  "uk": "Заблоковано {n} · очищено посилань: {links}"
 },
 "{n} filter lists": {
  "tr": "{n} filtre listesi",
  "es": "{n} listas de filtros",
  "pt": "{n} listas de filtros",
  "fr": "{n} listes de filtres",
  "uk": "Списків фільтрів: {n}"
 },
 "Shield on": {
  "tr": "Kalkan açık",
  "es": "Escudo activado",
  "pt": "Escudo ativado",
  "fr": "Bouclier activé",
  "uk": "Щит увімкнено"
 },
 "Shield paused": {
  "tr": "Kalkan duraklatıldı",
  "es": "Escudo en pausa",
  "pt": "Escudo em pausa",
  "fr": "Bouclier en pause",
  "uk": "Щит призупинено"
 },
 "Close tab · stays pinned": {
  "tr": "Sekmeyi kapat · sabit kalır",
  "es": "Cerrar pestaña · sigue fijada",
  "pt": "Fechar separador · continua fixado",
  "fr": "Fermer l’onglet · reste épinglé",
  "uk": "Закрити вкладку · залишиться закріпленою"
 },
 "Remove pinned tab": {
  "tr": "Sabit sekmeyi kaldır",
  "es": "Quitar pestaña fijada",
  "pt": "Remover separador fixado",
  "fr": "Retirer l’onglet épinglé",
  "uk": "Прибрати закріплену вкладку"
 },
 "Closed · still pinned": {
  "tr": "Kapatıldı · hâlâ sabit",
  "es": "Cerrada · sigue fijada",
  "pt": "Fechado · continua fixado",
  "fr": "Fermé · toujours épinglé",
  "uk": "Закрито · досі закріплена"
 },
 "Removed · ⌘Z brings it back": {
  "tr": "Kaldırıldı · ⌘Z geri getirir",
  "es": "Quitada · ⌘Z la recupera",
  "pt": "Removido · ⌘Z recupera-o",
  "fr": "Retiré · ⌘Z le ramène",
  "uk": "Прибрано · ⌘Z поверне"
 },
 "Nothing to bring back": {
  "tr": "Geri getirilecek bir şey yok",
  "es": "Nada que recuperar",
  "pt": "Nada para recuperar",
  "fr": "Rien à ramener",
  "uk": "Нічого повертати"
 },
 "Restore closed tab": {
  "tr": "Kapatılan sekmeyi geri getir",
  "es": "Restaurar pestaña cerrada",
  "pt": "Restaurar separador fechado",
  "fr": "Restaurer l’onglet fermé",
  "uk": "Відновити закриту вкладку"
 },
 "Keep tab": {
  "tr": "Sekmeyi tut",
  "es": "Mantener pestaña",
  "pt": "Manter separador",
  "fr": "Garder l’onglet",
  "uk": "Залишити вкладку"
 },
 "Discard input": {
  "tr": "Girileni sil",
  "es": "Descartar lo escrito",
  "pt": "Descartar o texto",
  "fr": "Abandonner la saisie",
  "uk": "Скасувати введене"
 },
 "Close this tab and discard your input?": {
  "tr": "Bu sekme kapatılsın ve girdikleriniz silinsin mi?",
  "es": "¿Cerrar esta pestaña y descartar lo que escribiste?",
  "pt": "Fechar este separador e descartar o que escreveu?",
  "fr": "Fermer cet onglet et abandonner votre saisie ?",
  "uk": "Закрити цю вкладку й скасувати введене?"
 },
 "Mail": {
  "tr": "E-posta",
  "es": "Correo",
  "pt": "Correio",
  "fr": "Mail",
  "uk": "Пошта"
 },
 "Asking AI": {
  "tr": "Yapay zekâya sorular",
  "es": "Preguntando a la IA",
  "pt": "A perguntar à IA",
  "fr": "Questions à l’IA",
  "uk": "Питання до ШІ"
 },
 "Coding": {
  "tr": "Kodlama",
  "es": "Programando",
  "pt": "A programar",
  "fr": "Code",
  "uk": "Програмування"
 },
 "Working": {
  "tr": "Çalışma",
  "es": "Trabajando",
  "pt": "A trabalhar",
  "fr": "Travail",
  "uk": "Робота"
 },
 "Watching": {
  "tr": "İzleme",
  "es": "Viendo vídeos",
  "pt": "A ver vídeos",
  "fr": "Vidéos",
  "uk": "Перегляд"
 },
 "Listening": {
  "tr": "Dinleme",
  "es": "Escuchando",
  "pt": "A ouvir",
  "fr": "Écoute",
  "uk": "Прослуховування"
 },
 "Social": {
  "tr": "Sosyal medya",
  "es": "Redes sociales",
  "pt": "Redes sociais",
  "fr": "Réseaux sociaux",
  "uk": "Соцмережі"
 },
 "Catching up on news": {
  "tr": "Haberler",
  "es": "Poniéndote al día",
  "pt": "A pôr as notícias em dia",
  "fr": "Actualités",
  "uk": "Новини"
 },
 "Shopping": {
  "tr": "Alışveriş",
  "es": "Compras",
  "pt": "Compras",
  "fr": "Shopping",
  "uk": "Покупки"
 },
 "Learning": {
  "tr": "Öğrenme",
  "es": "Aprendiendo",
  "pt": "A aprender",
  "fr": "Apprentissage",
  "uk": "Навчання"
 },
 "Planning travel": {
  "tr": "Seyahat planı",
  "es": "Planeando un viaje",
  "pt": "A planear viagens",
  "fr": "Préparatifs de voyage",
  "uk": "Планування подорожі"
 },
 "Money matters": {
  "tr": "Para işleri",
  "es": "Finanzas",
  "pt": "Finanças",
  "fr": "Finances",
  "uk": "Фінанси"
 },
 "{h} h {m} min": {
  "tr": "{h} sa {m} dk",
  "es": "{h} h {m} min",
  "pt": "{h} h {m} min",
  "fr": "{h} h {m} min",
  "uk": "{h} год {m} хв"
 },
 "{m} min": {
  "tr": "{m} dk",
  "es": "{m} min",
  "pt": "{m} min",
  "fr": "{m} min",
  "uk": "{m} хв"
 },
 "Today": {
  "tr": "Bugün",
  "es": "Hoy",
  "pt": "Hoje",
  "fr": "Aujourd’hui",
  "uk": "Сьогодні"
 },
 "Mostly {activity}, across {count} chapters": {
  "tr": "Çoğunlukla {activity}, {count} bölümde",
  "es": "Sobre todo {activity}, en {count} capítulos",
  "pt": "Sobretudo {activity}, em {count} capítulos",
  "fr": "Surtout {activity}, en {count} chapitres",
  "uk": "Переважно {activity}, у {count} розділах"
 },
 "Mostly {activity}": {
  "tr": "Çoğunlukla {activity}",
  "es": "Sobre todo {activity}",
  "pt": "Sobretudo {activity}",
  "fr": "Surtout {activity}",
  "uk": "Переважно {activity}"
 },
 "You usually open around now": {
  "tr": "Genelde bu saatlerde açtıkların",
  "es": "Lo que sueles abrir a esta hora",
  "pt": "O que costuma abrir a esta hora",
  "fr": "Ce que vous ouvrez souvent à cette heure",
  "uk": "Що ви зазвичай відкриваєте в цей час"
 },
 "Name my day in Spectrum": {
  "tr": "Spectrum günümü adlandırsın",
  "es": "Que Spectrum ponga nombre a mi día",
  "pt": "O Spectrum dá nome ao meu dia",
  "fr": "Spectrum nomme ma journée",
  "uk": "Spectrum називає мій день"
 },
 "Apple Intelligence titles each part of your day and suggests sites you usually open. It runs on this Mac; nothing is sent anywhere.": {
  "tr": "Apple Intelligence gününün her bölümüne bir başlık verir ve genelde açtığın siteleri önerir. Bu Mac’te çalışır; hiçbir yere bir şey gönderilmez.",
  "es": "Apple Intelligence titula cada parte de tu día y sugiere los sitios que sueles abrir. Funciona en este Mac; no se envía nada.",
  "pt": "O Apple Intelligence dá título a cada parte do seu dia e sugere os sites que costuma abrir. Funciona neste Mac; nada é enviado.",
  "fr": "Apple Intelligence donne un titre à chaque moment de votre journée et suggère les sites que vous ouvrez souvent. Tout se fait sur ce Mac ; rien n’est envoyé.",
  "uk": "Apple Intelligence дає назву кожній частині вашого дня й пропонує сайти, які ви зазвичай відкриваєте. Працює на цьому Mac; нічого нікуди не надсилається."
 },
 "Lean memory mode": {
  "tr": "Hafif bellek modu",
  "es": "Modo de memoria ligera",
  "pt": "Modo de memória leve",
  "fr": "Mode mémoire légère",
  "uk": "Ощадливий режим пам’яті"
 },
 "Sleep idle tabs when macOS runs short of memory. Keeps up to 1 GB of web cache on disk so sleeping tabs come back quickly. Cookies, passwords and site storage stay intact.": {
  "tr": "macOS’ta bellek azaldığında boştaki sekmeleri uyutur. Uyuyan sekmeler hızlı geri gelsin diye diskte 1 GB’a kadar web önbelleği tutar. Çerezler, parolalar ve site verileri korunur.",
  "es": "Duerme las pestañas inactivas cuando macOS se queda sin memoria. Guarda hasta 1 GB de caché web en el disco para que las pestañas dormidas vuelvan rápido. Cookies, contraseñas y datos de sitios se conservan.",
  "pt": "Adormece separadores inativos quando o macOS fica com pouca memória. Mantém até 1 GB de cache web no disco para que separadores adormecidos voltem depressa. Cookies, palavras-passe e dados de sites mantêm-se.",
  "fr": "Met en veille les onglets inactifs quand macOS manque de mémoire. Garde jusqu’à 1 Go de cache web sur le disque pour que les onglets en veille reviennent vite. Cookies, mots de passe et données des sites sont conservés.",
  "uk": "Присипляє неактивні вкладки, коли macOS бракує пам’яті. Зберігає до 1 ГБ веб-кешу на диску, щоб приспані вкладки швидко поверталися. Cookie, паролі й дані сайтів зберігаються."
 },
 "Chromium {n} is out · Prism will update": {
  "tr": "Chromium {n} çıktı · Prism güncellenecek",
  "es": "Chromium {n} ya salió · Prism se actualizará",
  "pt": "Chromium {n} já saiu · o Prism vai atualizar",
  "fr": "Chromium {n} est sorti · Prism se mettra à jour",
  "uk": "Вийшов Chromium {n} · Prism оновиться"
 },
 "Checks are off.": {
  "tr": "Denetim kapalı.",
  "es": "Las comprobaciones están desactivadas.",
  "pt": "As verificações estão desligadas.",
  "fr": "Les vérifications sont désactivées.",
  "uk": "Перевірки вимкнено."
 },
 "Chromium {v} is available in Electron {e}. Prism’s next update brings it.": {
  "tr": "Chromium {v}, Electron {e} ile çıktı. Prism’in bir sonraki güncellemesi onu getirecek.",
  "es": "Chromium {v} está disponible en Electron {e}. La próxima actualización de Prism lo traerá.",
  "pt": "O Chromium {v} está disponível no Electron {e}. A próxima atualização do Prism traz.",
  "fr": "Chromium {v} est disponible dans Electron {e}. La prochaine mise à jour de Prism l’apportera.",
  "uk": "Chromium {v} доступний в Electron {e}. Наступне оновлення Prism його принесе."
 },
 "Electron {e} is available. Prism’s next update brings it.": {
  "tr": "Electron {e} çıktı. Prism’in bir sonraki güncellemesi onu getirecek.",
  "es": "Electron {e} está disponible. La próxima actualización de Prism lo traerá.",
  "pt": "O Electron {e} está disponível. A próxima atualização do Prism traz.",
  "fr": "Electron {e} est disponible. La prochaine mise à jour de Prism l’apportera.",
  "uk": "Electron {e} доступний. Наступне оновлення Prism його принесе."
 },
 "Chrome {v} is out; Electron has not shipped it yet.": {
  "tr": "Chrome {v} çıktı; Electron henüz yayımlamadı.",
  "es": "Chrome {v} ya salió; Electron aún no lo incluye.",
  "pt": "O Chrome {v} já saiu; o Electron ainda não o inclui.",
  "fr": "Chrome {v} est sorti ; Electron ne l’a pas encore intégré.",
  "uk": "Вийшов Chrome {v}; Electron його ще не випустив."
 },
 "Up to date with Chrome {v}.": {
  "tr": "Chrome {v} ile güncel.",
  "es": "Al día con Chrome {v}.",
  "pt": "Atualizado com o Chrome {v}.",
  "fr": "À jour avec Chrome {v}.",
  "uk": "Актуально з Chrome {v}."
 },
 "Could not check. Prism will try again next time it opens.": {
  "tr": "Denetlenemedi. Prism bir sonraki açılışta yeniden deneyecek.",
  "es": "No se pudo comprobar. Prism lo intentará de nuevo la próxima vez que se abra.",
  "pt": "Não foi possível verificar. O Prism tenta de novo na próxima vez que abrir.",
  "fr": "Vérification impossible. Prism réessaiera à sa prochaine ouverture.",
  "uk": "Не вдалося перевірити. Prism спробує знову під час наступного запуску."
 },
 "Checked each time Prism opens.": {
  "tr": "Prism her açıldığında denetlenir.",
  "es": "Se comprueba cada vez que se abre Prism.",
  "pt": "Verificado sempre que o Prism abre.",
  "fr": "Vérifié à chaque ouverture de Prism.",
  "uk": "Перевіряється щоразу, коли відкривається Prism."
 },
 "Check for Chromium updates": {
  "tr": "Chromium güncellemelerini denetle",
  "es": "Buscar actualizaciones de Chromium",
  "pt": "Procurar atualizações do Chromium",
  "fr": "Rechercher les mises à jour de Chromium",
  "uk": "Перевіряти оновлення Chromium"
 },
 "Each time Prism opens, compare its Chromium with the newest Chrome and Electron releases. Only public version lists are requested.": {
  "tr": "Prism her açıldığında Chromium sürümünü en yeni Chrome ve Electron sürümleriyle karşılaştırır. Yalnızca herkese açık sürüm listeleri istenir.",
  "es": "Cada vez que se abre Prism, compara su Chromium con las versiones más recientes de Chrome y Electron. Solo se piden listas de versiones públicas.",
  "pt": "Sempre que o Prism abre, compara o seu Chromium com as versões mais recentes do Chrome e do Electron. Só são pedidas listas públicas de versões.",
  "fr": "À chaque ouverture, Prism compare son Chromium aux dernières versions de Chrome et d’Electron. Seules des listes publiques de versions sont demandées.",
  "uk": "Щоразу під час запуску Prism порівнює свій Chromium з найновішими випусками Chrome і Electron. Запитуються лише публічні списки версій."
 },
 "Checking…": {
  "tr": "Denetleniyor…",
  "es": "Comprobando…",
  "pt": "A verificar…",
  "fr": "Vérification…",
  "uk": "Перевірка…"
 },
 "Opened in background": {
  "tr": "Arka planda açıldı",
  "es": "Abierta en segundo plano",
  "pt": "Aberto em segundo plano",
  "fr": "Ouvert en arrière-plan",
  "uk": "Відкрито у фоні"
 },
 "Open Link in Background Tab": {
  "tr": "Bağlantıyı arka plan sekmesinde aç",
  "es": "Abrir enlace en pestaña en segundo plano",
  "pt": "Abrir ligação em separador em segundo plano",
  "fr": "Ouvrir le lien dans un onglet en arrière-plan",
  "uk": "Відкрити посилання у фоновій вкладці"
 },
 "Simple addresses": {
  "tr": "Sade adresler",
  "es": "Direcciones simples",
  "pt": "Endereços simples",
  "fr": "Adresses simplifiées",
  "uk": "Прості адреси"
 },
 "Show just the site’s name in the address field; the full address appears when you click it.": {
  "tr": "Adres alanında yalnızca sitenin adını gösterir; tıklayınca tam adres görünür.",
  "es": "Muestra solo el nombre del sitio en el campo de dirección; la dirección completa aparece al hacer clic.",
  "pt": "Mostra só o nome do site no campo de endereço; o endereço completo aparece ao clicar.",
  "fr": "Affiche seulement le nom du site dans le champ d’adresse ; l’adresse complète apparaît quand vous cliquez.",
  "uk": "Показує лише назву сайту в полі адреси; повна адреса з’являється після натискання."
 },
 "Use passwords in Private": {
  "tr": "Özel’de parolaları kullan",
  "es": "Usar contraseñas en Privado",
  "pt": "Usar palavras-passe em Privado",
  "fr": "Utiliser les mots de passe en Privé",
  "uk": "Використовувати паролі в Приватному"
 },
 "Fill saved passwords and cards in Private, after Touch ID. Private never saves new ones. Applies to new Private tabs.": {
  "tr": "Özel’de kayıtlı parolaları ve kartları Touch ID’den sonra doldurur. Özel asla yenilerini kaydetmez. Yeni Özel sekmelerde geçerlidir.",
  "es": "Rellena contraseñas y tarjetas guardadas en Privado tras Touch ID. Privado nunca guarda nuevas. Se aplica a nuevas pestañas privadas.",
  "pt": "Preenche palavras-passe e cartões guardados em Privado após o Touch ID. O Privado nunca guarda novos. Aplica-se a novos separadores privados.",
  "fr": "Remplit les mots de passe et cartes enregistrés en Privé après Touch ID. Privé n’en enregistre jamais de nouveaux. S’applique aux nouveaux onglets privés.",
  "uk": "Заповнює збережені паролі й картки в Приватному після Touch ID. Приватний режим ніколи не зберігає нові. Діє для нових приватних вкладок."
 },
 "Private protections everywhere": {
  "tr": "Özel korumalar her yerde",
  "es": "Protecciones de Privado en todas partes",
  "pt": "Proteções do Privado em todo o lado",
  "fr": "Protections de Privé partout",
  "uk": "Захист Приватного всюди"
 },
 "Your other spaces keep no history and no Spectrum, hide your Mac’s local address from video calls and look sites up over encrypted DNS, like Private. Cookies and sign-ins stay.": {
  "tr": "Diğer alanların da Özel gibi geçmiş ve Spectrum tutmaz, Mac’inin yerel adresini görüntülü aramalardan gizler ve siteleri şifreli DNS ile bulur. Çerezler ve oturumlar kalır.",
  "es": "Tus otros espacios no guardan historial ni Spectrum, ocultan la dirección local de tu Mac en videollamadas y buscan sitios con DNS cifrado, como Privado. Las cookies y sesiones se mantienen.",
  "pt": "Os seus outros espaços não guardam histórico nem Spectrum, escondem o endereço local do Mac nas videochamadas e procuram sites por DNS cifrado, como o Privado. Cookies e sessões mantêm-se.",
  "fr": "Vos autres espaces ne gardent ni historique ni Spectrum, masquent l’adresse locale de votre Mac aux appels vidéo et cherchent les sites via DNS chiffré, comme Privé. Cookies et connexions restent.",
  "uk": "Інші простори не зберігають історію та Spectrum, приховують локальну адресу Mac від відеодзвінків і шукають сайти через зашифрований DNS, як Приватний. Cookie та входи зберігаються."
 },
 "Customize": {
  "tr": "Özelleştir",
  "es": "Personalizar",
  "pt": "Personalizar",
  "fr": "Personnaliser",
  "uk": "Налаштувати вигляд"
 },
 "Chrome Web Store": {
  "tr": "Chrome Web Mağazası",
  "es": "Chrome Web Store",
  "pt": "Chrome Web Store",
  "fr": "Chrome Web Store",
  "uk": "Chrome Web Store"
 },
 "Open Passwords app": {
  "tr": "Parolalar uygulamasını aç",
  "es": "Abrir la app Contraseñas",
  "pt": "Abrir a app Palavras-passe",
  "fr": "Ouvrir l’app Mots de passe",
  "uk": "Відкрити програму «Паролі»"
 },
 "New Private tab": {
  "tr": "Yeni Özel sekme",
  "es": "Nueva pestaña privada",
  "pt": "Novo separador privado",
  "fr": "Nouvel onglet privé",
  "uk": "Нова приватна вкладка"
 },
 "Keyboard shortcuts: ⌘T Beam · ⌘K new tab · ⌘L address · ⌘D bookmark · ⌘, settings · ⌘J downloads. Focus the sidebar divider and use arrow keys to resize.": {
  "tr": "Klavye kısayolları: ⌘T Işın · ⌘K yeni sekme · ⌘L adres · ⌘D yer imi · ⌘, ayarlar · ⌘J indirmeler. Boyutlandırmak için kenar çubuğu ayırıcısına odaklanıp ok tuşlarını kullan.",
  "es": "Atajos de teclado: ⌘T Haz · ⌘K nueva pestaña · ⌘L dirección · ⌘D marcador · ⌘, ajustes · ⌘J descargas. Enfoca el divisor de la barra lateral y usa las flechas para cambiar su tamaño.",
  "pt": "Atalhos de teclado: ⌘T Feixe · ⌘K novo separador · ⌘L endereço · ⌘D marcador · ⌘, definições · ⌘J transferências. Foque o divisor da barra lateral e use as setas para redimensionar.",
  "fr": "Raccourcis clavier : ⌘T Faisceau · ⌘K nouvel onglet · ⌘L adresse · ⌘D signet · ⌘, réglages · ⌘J téléchargements. Placez le focus sur le séparateur de la barre latérale et utilisez les flèches pour redimensionner.",
  "uk": "Клавіатурні скорочення: ⌘T Промінь · ⌘K нова вкладка · ⌘L адреса · ⌘D закладка · ⌘, налаштування · ⌘J завантаження. Наведіть фокус на роздільник бічної панелі й змінюйте розмір стрілками."
 },
 "Open Beam: type an address, search, or find any tab, setting or action. ⌘K opens a blank tab.": {
  "tr": "Işın’ı açar: adres yaz, ara ya da herhangi bir sekmeyi, ayarı veya eylemi bul. ⌘K boş sekme açar.",
  "es": "Abre Haz: escribe una dirección, busca o encuentra cualquier pestaña, ajuste o acción. ⌘K abre una pestaña en blanco.",
  "pt": "Abre o Feixe: escreva um endereço, pesquise ou encontre qualquer separador, definição ou ação. ⌘K abre um separador em branco.",
  "fr": "Ouvre Faisceau : tapez une adresse, cherchez, ou trouvez un onglet, un réglage ou une action. ⌘K ouvre un onglet vide.",
  "uk": "Відкриває Промінь: введіть адресу, шукайте або знайдіть будь-яку вкладку, налаштування чи дію. ⌘K відкриває порожню вкладку."
 },
 "Bring it back": {
  "tr": "Geri getir",
  "es": "Recuperarla",
  "pt": "Recuperar",
  "fr": "La ramener",
  "uk": "Повернути"
 },
 "Bring back {count} tabs": {
  "tr": "{count} sekmeyi geri getir",
  "es": "Recuperar {count} pestañas",
  "pt": "Recuperar {count} separadores",
  "fr": "Ramener {count} onglets",
  "uk": "Повернути вкладки: {count}"
 },
 "Release notes": {
  "tr": "Sürüm notları",
  "es": "Notas de la versión",
  "pt": "Notas de lançamento",
  "fr": "Notes de version",
  "uk": "Нотатки до випуску"
 },
 "Release Notes": {
  "tr": "Sürüm Notları",
  "es": "Notas de la versión",
  "pt": "Notas de lançamento",
  "fr": "Notes de version",
  "uk": "Нотатки до випуску"
 },
 "See everything new": {
  "tr": "Tüm yenilikleri gör",
  "es": "Ver todas las novedades",
  "pt": "Ver todas as novidades",
  "fr": "Voir toutes les nouveautés",
  "uk": "Переглянути все нове"
 },
 "AI for Prism": {
  "tr": "Prism için yapay zekâ",
  "es": "IA para Prism",
  "pt": "IA para o Prism",
  "fr": "IA pour Prism",
  "uk": "ШІ для Prism"
 },
 "Used for download names, page summaries and translations, and Spectrum.": {
  "tr": "İndirme adları, sayfa özetleri ve çevirileri ile Spectrum için kullanılır.",
  "es": "Se usa para nombres de descargas, resúmenes y traducciones de páginas, y Spectrum.",
  "pt": "Usada para nomes de transferências, resumos e traduções de páginas e o Spectrum.",
  "fr": "Utilisée pour les noms de téléchargements, les résumés et traductions de pages, et Spectrum.",
  "uk": "Використовується для назв завантажень, підсумків і перекладів сторінок та Spectrum."
 },
 "Claude · your Anthropic API key": {
  "tr": "Claude · Anthropic API anahtarın",
  "es": "Claude · tu clave de API de Anthropic",
  "pt": "Claude · a sua chave de API da Anthropic",
  "fr": "Claude · votre clé d’API Anthropic",
  "uk": "Claude · ваш ключ API Anthropic"
 },
 "Anthropic API key": {
  "tr": "Anthropic API anahtarı",
  "es": "Clave de API de Anthropic",
  "pt": "Chave de API da Anthropic",
  "fr": "Clé d’API Anthropic",
  "uk": "Ключ API Anthropic"
 },
 "Create one at console.anthropic.com. Stored encrypted on this Mac.": {
  "tr": "console.anthropic.com adresinden oluştur. Bu Mac’te şifreli saklanır.",
  "es": "Créala en console.anthropic.com. Se guarda cifrada en este Mac.",
  "pt": "Crie uma em console.anthropic.com. Guardada cifrada neste Mac.",
  "fr": "Créez-en une sur console.anthropic.com. Stockée chiffrée sur ce Mac.",
  "uk": "Створіть на console.anthropic.com. Зберігається зашифрованим на цьому Mac."
 },
 "Name downloads, summarize and translate pages, and title your day in Spectrum.": {
  "tr": "İndirmeleri adlandır, sayfaları özetle ve çevir, Spectrum’da gününe başlık ver.",
  "es": "Nombra descargas, resume y traduce páginas y titula tu día en Spectrum.",
  "pt": "Dê nome a transferências, resuma e traduza páginas e dê título ao seu dia no Spectrum.",
  "fr": "Nommez les téléchargements, résumez et traduisez des pages, et titrez votre journée dans Spectrum.",
  "uk": "Називайте завантаження, підсумовуйте й перекладайте сторінки та давайте назви своєму дню в Spectrum."
 },
 "The AI above titles each part of your day when you open Spectrum, and Spectrum suggests sites you usually open.": {
  "tr": "Yukarıdaki yapay zekâ Spectrum’u açtığında gününün her bölümüne başlık verir; Spectrum genelde açtığın siteleri önerir.",
  "es": "La IA de arriba titula cada parte de tu día al abrir Spectrum, y Spectrum sugiere los sitios que sueles abrir.",
  "pt": "A IA acima dá título a cada parte do seu dia quando abre o Spectrum, e o Spectrum sugere os sites que costuma abrir.",
  "fr": "L’IA ci-dessus titre chaque moment de votre journée quand vous ouvrez Spectrum, et Spectrum suggère les sites que vous ouvrez souvent.",
  "uk": "ШІ вище дає назву кожній частині дня, коли ви відкриваєте Spectrum, а Spectrum пропонує сайти, які ви зазвичай відкриваєте."
 },
 "Redo": {
  "tr": "Yinele",
  "es": "Rehacer",
  "pt": "Refazer",
  "fr": "Rétablir",
  "uk": "Повторити"
 },
 "Cut": {
  "tr": "Kes",
  "es": "Cortar",
  "pt": "Cortar",
  "fr": "Couper",
  "uk": "Вирізати"
 },
 "Copy": {
  "tr": "Kopyala",
  "es": "Copiar",
  "pt": "Copiar",
  "fr": "Copier",
  "uk": "Копіювати"
 },
 "Paste": {
  "tr": "Yapıştır",
  "es": "Pegar",
  "pt": "Colar",
  "fr": "Coller",
  "uk": "Вставити"
 },
 "Paste and Match Style": {
  "tr": "Yapıştır ve Stili Eşleştir",
  "es": "Pegar con el mismo estilo",
  "pt": "Colar com o mesmo estilo",
  "fr": "Coller et adapter le style",
  "uk": "Вставити з тим самим стилем"
 },
 "Select All": {
  "tr": "Tümünü Seç",
  "es": "Seleccionar todo",
  "pt": "Selecionar tudo",
  "fr": "Tout sélectionner",
  "uk": "Вибрати все"
 },
 "Paste and Go": {
  "tr": "Yapıştır ve Git",
  "es": "Pegar e ir",
  "pt": "Colar e ir",
  "fr": "Coller et aller",
  "uk": "Вставити й перейти"
 },
 "Paste and Search": {
  "tr": "Yapıştır ve Ara",
  "es": "Pegar y buscar",
  "pt": "Colar e pesquisar",
  "fr": "Coller et rechercher",
  "uk": "Вставити й шукати"
 },
 "Ask Claude": {
  "tr": "Claude’a sor",
  "es": "Preguntar a Claude",
  "pt": "Perguntar ao Claude",
  "fr": "Demander à Claude",
  "uk": "Запитати Claude"
 },
 "Search with an image": {
  "tr": "Görselle ara",
  "es": "Buscar con una imagen",
  "pt": "Pesquisar com uma imagem",
  "fr": "Rechercher avec une image",
  "uk": "Шукати за зображенням"
 },
 "Search with the copied image": {
  "tr": "Kopyalanan görselle ara",
  "es": "Buscar con la imagen copiada",
  "pt": "Pesquisar com a imagem copiada",
  "fr": "Rechercher avec l’image copiée",
  "uk": "Шукати за скопійованим зображенням"
 },
 "Search, type an address, ask, or paste an image": {
  "tr": "Ara, adres yaz, sor ya da görsel yapıştır",
  "es": "Busca, escribe una dirección, pregunta o pega una imagen",
  "pt": "Pesquise, escreva um endereço, pergunte ou cole uma imagem",
  "fr": "Cherchez, tapez une adresse, posez une question ou collez une image",
  "uk": "Шукайте, введіть адресу, запитайте або вставте зображення"
 },
 "Claude had no answer.": {
  "tr": "Claude bir yanıt veremedi.",
  "es": "Claude no tuvo respuesta.",
  "pt": "O Claude não teve resposta.",
  "fr": "Claude n’a pas de réponse.",
  "uk": "Claude не має відповіді."
 },
 "Choose Claude in Settings → AI & assistants to ask Beam.": {
  "tr": "Işın’a sormak için Ayarlar → Yapay zekâ ve asistanlar’da Claude’u seç.",
  "es": "Elige Claude en Ajustes → IA y asistentes para preguntar a Haz.",
  "pt": "Escolha o Claude em Definições → IA e assistentes para perguntar ao Feixe.",
  "fr": "Choisissez Claude dans Réglages → IA et assistants pour interroger Faisceau.",
  "uk": "Виберіть Claude у Налаштуваннях → ШІ та помічники, щоб питати Промінь."
 },
 "Ask Apple Intelligence": {
  "tr": "Apple Intelligence’a sor",
  "es": "Preguntar a Apple Intelligence",
  "pt": "Perguntar ao Apple Intelligence",
  "fr": "Demander à Apple Intelligence",
  "uk": "Запитати Apple Intelligence"
 },
 "No answer came back.": {
  "tr": "Yanıt gelmedi.",
  "es": "No llegó ninguna respuesta.",
  "pt": "Não chegou resposta.",
  "fr": "Aucune réponse n’est revenue.",
  "uk": "Відповіді немає."
 },
 "Choose Claude or Apple Intelligence in Settings → AI & assistants to ask Beam.": {
  "tr": "Işın’a sormak için Ayarlar → Yapay zekâ ve asistanlar’da Claude’u ya da Apple Intelligence’ı seç.",
  "es": "Elige Claude o Apple Intelligence en Ajustes → IA y asistentes para preguntar a Haz.",
  "pt": "Escolha o Claude ou o Apple Intelligence em Definições → IA e assistentes para perguntar ao Feixe.",
  "fr": "Choisissez Claude ou Apple Intelligence dans Réglages → IA et assistants pour interroger Faisceau.",
  "uk": "Виберіть Claude або Apple Intelligence у Налаштуваннях → ШІ та помічники, щоб питати Промінь."
 },
 "Bypass in Personal and Work": {
  "tr": "Kişisel ve İş’te engel aşma",
  "es": "Evasión en Personal y Trabajo",
  "pt": "Contorno em Pessoal e Trabalho",
  "fr": "Contournement dans Personnel et Travail",
  "uk": "Обхід в Особистому та Робочому"
 },
 "Use bypass": {
  "tr": "Engel aşmayı kullan",
  "es": "Usar evasión",
  "pt": "Usar contorno",
  "fr": "Utiliser le contournement",
  "uk": "Використовувати обхід"
 },
 "Only chosen sites keeps everything else on your normal connection.": {
  "tr": "Yalnızca seçilen siteler, geri kalan her şeyi normal bağlantında tutar.",
  "es": "Solo los sitios elegidos mantiene todo lo demás en tu conexión normal.",
  "pt": "Apenas os sites escolhidos mantém tudo o resto na sua ligação normal.",
  "fr": "Seulement les sites choisis garde tout le reste sur votre connexion normale.",
  "uk": "Лише вибрані сайти залишає все інше на звичайному з’єднанні."
 },
 "Only chosen sites": {
  "tr": "Yalnızca seçilen siteler",
  "es": "Solo los sitios elegidos",
  "pt": "Apenas os sites escolhidos",
  "fr": "Seulement les sites choisis",
  "uk": "Лише вибрані сайти"
 },
 "All sites": {
  "tr": "Tüm siteler",
  "es": "Todos los sitios",
  "pt": "Todos os sites",
  "fr": "Tous les sites",
  "uk": "Усі сайти"
 },
 "Chosen sites": {
  "tr": "Seçilen siteler",
  "es": "Sitios elegidos",
  "pt": "Sites escolhidos",
  "fr": "Sites choisis",
  "uk": "Вибрані сайти"
 },
 "A site brings its own domains: discord.com also covers discord.gg, its CDN and its gateway, so the connection holds while you move around it.": {
  "tr": "Bir site kendi alan adlarını da getirir: discord.com, discord.gg’yi, CDN’ini ve ağ geçidini de kapsar; böylece site içinde gezinirken bağlantı kopmaz.",
  "es": "Un sitio incluye sus propios dominios: discord.com también cubre discord.gg, su CDN y su pasarela, así la conexión se mantiene mientras navegas por él.",
  "pt": "Um site inclui os seus próprios domínios: discord.com também abrange discord.gg, a sua CDN e o seu gateway, para a ligação se manter enquanto navega nele.",
  "fr": "Un site inclut ses propres domaines : discord.com couvre aussi discord.gg, son CDN et sa passerelle, pour que la connexion tienne pendant que vous y naviguez.",
  "uk": "Сайт приносить свої домени: discord.com також охоплює discord.gg, його CDN і шлюз, тож з’єднання тримається, поки ви ним користуєтеся."
 },
 "Add": {
  "tr": "Ekle",
  "es": "Añadir",
  "pt": "Adicionar",
  "fr": "Ajouter",
  "uk": "Додати"
 },
 "Add current site": {
  "tr": "Geçerli siteyi ekle",
  "es": "Añadir el sitio actual",
  "pt": "Adicionar o site atual",
  "fr": "Ajouter le site actuel",
  "uk": "Додати поточний сайт"
 },
 "Passwords in Private": {
  "tr": "Özel’de parolalar",
  "es": "Contraseñas en Privado",
  "pt": "Palavras-passe em Privado",
  "fr": "Mots de passe en Privé",
  "uk": "Паролі в Приватному"
 },
 "Use Personal passwords in Private": {
  "tr": "Özel’de Kişisel parolaları kullan",
  "es": "Usar las contraseñas de Personal en Privado",
  "pt": "Usar as palavras-passe de Pessoal em Privado",
  "fr": "Utiliser les mots de passe de Personnel en Privé",
  "uk": "Використовувати особисті паролі в Приватному"
 },
 "Fill the logins and cards saved in Personal and Work, after Touch ID. Private never saves new ones.": {
  "tr": "Kişisel ve İş’te kayıtlı girişleri ve kartları Touch ID’den sonra doldurur. Özel asla yenilerini kaydetmez.",
  "es": "Rellena los inicios de sesión y tarjetas guardados en Personal y Trabajo tras Touch ID. Privado nunca guarda nuevos.",
  "pt": "Preenche os inícios de sessão e cartões guardados em Pessoal e Trabalho após o Touch ID. O Privado nunca guarda novos.",
  "fr": "Remplit les identifiants et cartes enregistrés dans Personnel et Travail après Touch ID. Privé n’en enregistre jamais de nouveaux.",
  "uk": "Заповнює логіни й картки, збережені в Особистому та Робочому, після Touch ID. Приватний режим ніколи не зберігає нові."
 },
 "Fill saved passwords and cards in Private, after Touch ID. Private never saves new ones.": {
  "tr": "Özel’de kayıtlı parolaları ve kartları Touch ID’den sonra doldurur. Özel asla yenilerini kaydetmez.",
  "es": "Rellena contraseñas y tarjetas guardadas en Privado tras Touch ID. Privado nunca guarda nuevas.",
  "pt": "Preenche palavras-passe e cartões guardados em Privado após o Touch ID. O Privado nunca guarda novos.",
  "fr": "Remplit les mots de passe et cartes enregistrés en Privé après Touch ID. Privé n’en enregistre jamais de nouveaux.",
  "uk": "Заповнює збережені паролі й картки в Приватному після Touch ID. Приватний режим ніколи не зберігає нові."
 },
 "Search suggestions": {
  "tr": "Arama önerileri",
  "es": "Sugerencias de búsqueda",
  "pt": "Sugestões de pesquisa",
  "fr": "Suggestions de recherche",
  "uk": "Пошукові підказки"
 },
 "Beam suggests searches from Google as you type. Only the typed text is sent; never in Private.": {
  "tr": "Işın, sen yazarken Google’dan arama önerir. Yalnızca yazılan metin gönderilir; Özel’de asla.",
  "es": "Haz sugiere búsquedas de Google mientras escribes. Solo se envía el texto escrito; nunca en Privado.",
  "pt": "O Feixe sugere pesquisas do Google enquanto escreve. Só é enviado o texto escrito; nunca em Privado.",
  "fr": "Faisceau suggère des recherches Google pendant la saisie. Seul le texte tapé est envoyé ; jamais en Privé.",
  "uk": "Промінь пропонує пошукові запити Google, поки ви друкуєте. Надсилається лише набраний текст; ніколи в Приватному."
 },
 "Change symbol…": {
  "tr": "Simgeyi değiştir…",
  "es": "Cambiar símbolo…",
  "pt": "Alterar símbolo…",
  "fr": "Changer de symbole…",
  "uk": "Змінити символ…"
 },
 "Folder symbol": {
  "tr": "Klasör simgesi",
  "es": "Símbolo de carpeta",
  "pt": "Símbolo da pasta",
  "fr": "Symbole du dossier",
  "uk": "Символ папки"
 },
 "While the bypass runs, Prism splits the first packets of each connection so filters can’t read them, and looks up sites over encrypted DNS (Cloudflare, Google) so blocked addresses resolve correctly. The helper is built into Prism (tpws from the open-source Zapret project); nothing is installed and no system settings change. If it fails in Private, Private requests stay blocked; in Personal and Work, sites fall back to your normal connection. It is not a VPN: sites still see your IP address.": {
  "tr": "Engel aşma çalışırken Prism, filtreler okuyamasın diye her bağlantının ilk paketlerini böler ve engellenen adresler doğru çözülsün diye siteleri şifreli DNS (Cloudflare, Google) üzerinden arar. Yardımcı araç Prism’e yerleşiktir (açık kaynaklı Zapret projesinden tpws); hiçbir şey kurulmaz ve sistem ayarları değişmez. Özel’de başarısız olursa Özel istekleri engelli kalır; Kişisel ve İş’te siteler normal bağlantına döner. Bu bir VPN değildir: siteler IP adresini yine görür.",
  "es": "Mientras la evasión funciona, Prism divide los primeros paquetes de cada conexión para que los filtros no puedan leerlos y busca los sitios por DNS cifrado (Cloudflare, Google) para que las direcciones bloqueadas se resuelvan bien. El asistente viene integrado en Prism (tpws del proyecto de código abierto Zapret); no se instala nada ni cambia ningún ajuste del sistema. Si falla en Privado, las solicitudes privadas siguen bloqueadas; en Personal y Trabajo, los sitios vuelven a tu conexión normal. No es una VPN: los sitios siguen viendo tu dirección IP.",
  "pt": "Enquanto o contorno funciona, o Prism divide os primeiros pacotes de cada ligação para que os filtros não os consigam ler e procura os sites por DNS cifrado (Cloudflare, Google) para que os endereços bloqueados sejam resolvidos corretamente. O auxiliar vem integrado no Prism (tpws do projeto de código aberto Zapret); nada é instalado e nenhuma definição do sistema muda. Se falhar em Privado, os pedidos privados continuam bloqueados; em Pessoal e Trabalho, os sites voltam à sua ligação normal. Não é uma VPN: os sites continuam a ver o seu endereço IP.",
  "fr": "Pendant le contournement, Prism découpe les premiers paquets de chaque connexion pour que les filtres ne puissent pas les lire, et résout les sites via un DNS chiffré (Cloudflare, Google) pour que les adresses bloquées soient correctement résolues. L’outil est intégré à Prism (tpws du projet open source Zapret) ; rien n’est installé et aucun réglage système ne change. En cas d’échec en Privé, les requêtes privées restent bloquées ; dans Personnel et Travail, les sites reviennent à votre connexion normale. Ce n’est pas un VPN : les sites voient toujours votre adresse IP.",
  "uk": "Поки працює обхід, Prism розділяє перші пакети кожного з’єднання, щоб фільтри не могли їх прочитати, і шукає сайти через зашифрований DNS (Cloudflare, Google), щоб заблоковані адреси визначалися правильно. Помічник вбудовано в Prism (tpws з відкритого проєкту Zapret); нічого не встановлюється і системні налаштування не змінюються. Якщо в Приватному він не спрацює, приватні запити залишаться заблокованими; в Особистому та Робочому сайти повернуться до звичайного з’єднання. Це не VPN: сайти все одно бачать вашу IP-адресу."
 },
 "Bypass in Private": {
  "tr": "Özel’de engel aşma",
  "es": "Evasión en Privado",
  "pt": "Contorno em Privado",
  "fr": "Contournement en Privé",
  "uk": "Обхід у Приватному"
 },
 "Add a site, like x.com": {
  "tr": "Bir site ekle, ör. x.com",
  "es": "Añade un sitio, como x.com",
  "pt": "Adicione um site, como x.com",
  "fr": "Ajoutez un site, comme x.com",
  "uk": "Додайте сайт, наприклад x.com"
 },
 "Today · all spaces": {
  "tr": "Bugün · tüm alanlar",
  "es": "Hoy · todos los espacios",
  "pt": "Hoje · todos os espaços",
  "fr": "Aujourd’hui · tous les espaces",
  "uk": "Сьогодні · усі простори"
 },
 "This space": {
  "tr": "Bu alan",
  "es": "Este espacio",
  "pt": "Este espaço",
  "fr": "Cet espace",
  "uk": "Цей простір"
 },
 "All usage": {
  "tr": "Tüm kullanım",
  "es": "Todo el uso",
  "pt": "Toda a utilização",
  "fr": "Toute l’utilisation",
  "uk": "Усе використання"
 },
 "Show only this space": {
  "tr": "Yalnızca bu alanı göster",
  "es": "Mostrar solo este espacio",
  "pt": "Mostrar apenas este espaço",
  "fr": "Afficher seulement cet espace",
  "uk": "Показати лише цей простір"
 },
 "Show every space together": {
  "tr": "Tüm alanları birlikte göster",
  "es": "Mostrar todos los espacios juntos",
  "pt": "Mostrar todos os espaços juntos",
  "fr": "Afficher tous les espaces ensemble",
  "uk": "Показати всі простори разом"
 },
 "Added to Favorites": {
  "tr": "Favorilere eklendi",
  "es": "Añadido a Favoritos",
  "pt": "Adicionado aos Favoritos",
  "fr": "Ajouté aux favoris",
  "uk": "Додано до вибраного"
 },
 "Drop here to add to Favorites": {
  "tr": "Favorilere eklemek için buraya bırak",
  "es": "Suelta aquí para añadir a Favoritos",
  "pt": "Largue aqui para adicionar aos Favoritos",
  "fr": "Déposez ici pour ajouter aux favoris",
  "uk": "Перетягніть сюди, щоб додати до вибраного"
 },
 "Bring your bookmarks, passwords and history over from another browser in one click. Nothing in that browser changes.": {
  "tr": "Yer imlerini, parolalarını ve geçmişini başka bir tarayıcıdan tek tıkla getir. O tarayıcıda hiçbir şey değişmez.",
  "es": "Trae tus marcadores, contraseñas e historial desde otro navegador con un clic. Nada cambia en ese navegador.",
  "pt": "Traga os seus favoritos, palavras-passe e histórico de outro navegador com um clique. Nada muda nesse navegador.",
  "fr": "Importez vos favoris, mots de passe et historique depuis un autre navigateur en un clic. Rien ne change dans ce navigateur.",
  "uk": "Перенесіть закладки, паролі та історію з іншого браузера одним клацанням. У тому браузері нічого не зміниться."
 },
 "Other ways to import": {
  "tr": "Diğer içe aktarma yolları",
  "es": "Otras formas de importar",
  "pt": "Outras formas de importar",
  "fr": "Autres façons d’importer",
  "uk": "Інші способи імпорту"
 },
 "Bookmarks file…": {
  "tr": "Yer imi dosyası…",
  "es": "Archivo de marcadores…",
  "pt": "Ficheiro de favoritos…",
  "fr": "Fichier de favoris…",
  "uk": "Файл закладок…"
 },
 "Password CSV…": {
  "tr": "Parola CSV…",
  "es": "CSV de contraseñas…",
  "pt": "CSV de palavras-passe…",
  "fr": "CSV de mots de passe…",
  "uk": "CSV з паролями…"
 },
 "Native Preview bookmarks…": {
  "tr": "Native Preview yer imleri…",
  "es": "Marcadores de Native Preview…",
  "pt": "Favoritos do Native Preview…",
  "fr": "Favoris de Native Preview…",
  "uk": "Закладки Native Preview…"
 },
 "Undo bookmark & history import": {
  "tr": "Yer imi ve geçmiş aktarımını geri al",
  "es": "Deshacer importación de marcadores e historial",
  "pt": "Anular importação de favoritos e histórico",
  "fr": "Annuler l’import des favoris et de l’historique",
  "uk": "Скасувати імпорт закладок та історії"
 },
 "Each import keeps a protected backup, so Undo works until that data changes again. Logins you already saved in Prism are never replaced. Extensions, open tabs and site sign-ins aren’t copied.": {
  "tr": "Her aktarım korumalı bir yedek tutar; veriler yeniden değişene kadar geri alabilirsin. Prism’de kayıtlı girişlerin asla değiştirilmez. Uzantılar, açık sekmeler ve site oturumları kopyalanmaz.",
  "es": "Cada importación guarda una copia protegida, así que puedes deshacerla hasta que esos datos vuelvan a cambiar. Los inicios de sesión que ya guardaste en Prism nunca se reemplazan. No se copian extensiones, pestañas abiertas ni sesiones de sitios.",
  "pt": "Cada importação guarda uma cópia protegida, por isso pode anulá-la até esses dados mudarem outra vez. As credenciais que já guardou no Prism nunca são substituídas. Extensões, separadores abertos e sessões de sites não são copiados.",
  "fr": "Chaque import conserve une sauvegarde protégée : vous pouvez l’annuler tant que ces données ne changent pas. Les identifiants déjà enregistrés dans Prism ne sont jamais remplacés. Les extensions, onglets ouverts et connexions aux sites ne sont pas copiés.",
  "uk": "Кожен імпорт зберігає захищену резервну копію, тож його можна скасувати, доки ці дані не зміняться. Облікові дані, уже збережені в Prism, ніколи не замінюються. Розширення, відкриті вкладки та входи на сайти не копіюються."
 },
 "Your bookmarks, passwords and history can feel right at home.": {
  "tr": "Yer imlerin, parolaların ve geçmişin burada kendini evinde hissetsin.",
  "es": "Tus marcadores, contraseñas e historial se sentirán como en casa.",
  "pt": "Os seus favoritos, palavras-passe e histórico vão sentir-se em casa.",
  "fr": "Vos favoris, mots de passe et historique s’y sentiront comme chez eux.",
  "uk": "Ваші закладки, паролі та історія почуватимуться як удома."
 },
 "Pick a browser and what to bring over. Prism reads a copy, so nothing in that browser changes. You can also import a bookmarks file in Settings → Imports.": {
  "tr": "Bir tarayıcı ve neleri getireceğini seç. Prism bir kopyayı okur, o tarayıcıda hiçbir şey değişmez. Yer imi dosyasını Ayarlar → İçe aktarma’dan da getirebilirsin.",
  "es": "Elige un navegador y qué traer. Prism lee una copia, así que nada cambia en ese navegador. También puedes importar un archivo de marcadores en Ajustes → Importaciones.",
  "pt": "Escolha um navegador e o que trazer. O Prism lê uma cópia, por isso nada muda nesse navegador. Também pode importar um ficheiro de favoritos em Definições → Importações.",
  "fr": "Choisissez un navigateur et ce qu’il faut importer. Prism lit une copie, rien ne change dans ce navigateur. Vous pouvez aussi importer un fichier de favoris dans Réglages → Imports.",
  "uk": "Виберіть браузер і що перенести. Prism читає копію, тож у тому браузері нічого не зміниться. Файл закладок також можна імпортувати в Параметри → Імпорт."
 },
 "Chrome, Arc, Brave and Edge logins come over with one click on the previous step. Other password managers: export a CSV, then use the same button.": {
  "tr": "Chrome, Arc, Brave ve Edge girişleri önceki adımda tek tıkla gelir. Diğer parola yöneticileri: CSV dışa aktar, sonra aynı düğmeyi kullan.",
  "es": "Los inicios de sesión de Chrome, Arc, Brave y Edge se importan con un clic en el paso anterior. Otros gestores de contraseñas: exporta un CSV y usa el mismo botón.",
  "pt": "As credenciais do Chrome, Arc, Brave e Edge vêm com um clique no passo anterior. Outros gestores de palavras-passe: exporte um CSV e use o mesmo botão.",
  "fr": "Les identifiants de Chrome, Arc, Brave et Edge s’importent en un clic à l’étape précédente. Autres gestionnaires : exportez un CSV, puis utilisez le même bouton.",
  "uk": "Облікові дані Chrome, Arc, Brave та Edge переносяться одним клацанням на попередньому кроці. Інші менеджери паролів: експортуйте CSV і скористайтеся тією ж кнопкою."
 },
 "What to import": {
  "tr": "Neler aktarılsın",
  "es": "Qué importar",
  "pt": "O que importar",
  "fr": "Que importer",
  "uk": "Що імпортувати"
 },
 "Import": {
  "tr": "İçe aktar",
  "es": "Importar",
  "pt": "Importar",
  "fr": "Importer",
  "uk": "Імпортувати"
 },
 "Importing…": {
  "tr": "İçe aktarılıyor…",
  "es": "Importando…",
  "pt": "A importar…",
  "fr": "Import en cours…",
  "uk": "Імпорт…"
 },
 "Allow Full Disk Access…": {
  "tr": "Tam Disk Erişimi ver…",
  "es": "Permitir acceso total al disco…",
  "pt": "Permitir acesso total ao disco…",
  "fr": "Autoriser l’accès complet au disque…",
  "uk": "Дозволити повний доступ до диска…"
 },
 "Choose exported file…": {
  "tr": "Dışa aktarılan dosyayı seç…",
  "es": "Elegir archivo exportado…",
  "pt": "Escolher ficheiro exportado…",
  "fr": "Choisir le fichier exporté…",
  "uk": "Вибрати експортований файл…"
 },
 "For passwords, choose File → Export All Passwords in the Passwords app, then pick that file.": {
  "tr": "Parolalar için Parolalar uygulamasında Dosya → Tüm Parolaları Dışa Aktar’ı seç, sonra o dosyayı seç.",
  "es": "Para las contraseñas, elige Archivo → Exportar todas las contraseñas en la app Contraseñas y luego selecciona ese archivo.",
  "pt": "Para as palavras-passe, escolha Ficheiro → Exportar todas as palavras-passe na app Palavras-passe e depois selecione esse ficheiro.",
  "fr": "Pour les mots de passe, choisissez Fichier → Exporter tous les mots de passe dans l’app Mots de passe, puis sélectionnez ce fichier.",
  "uk": "Для паролів виберіть Файл → Експортувати всі паролі в застосунку Паролі, а потім виберіть цей файл."
 },
 "History is off because Prism keeps no history right now.": {
  "tr": "Prism şu anda geçmiş tutmadığı için geçmiş kapalı.",
  "es": "El historial está desactivado porque Prism no guarda historial ahora.",
  "pt": "O histórico está desativado porque o Prism não guarda histórico agora.",
  "fr": "L’historique est désactivé, car Prism n’en conserve pas pour le moment.",
  "uk": "Історію вимкнено, бо Prism зараз не зберігає історію."
 },
 "Nothing to import": {
  "tr": "Aktarılacak bir şey yok",
  "es": "Nada que importar",
  "pt": "Nada para importar",
  "fr": "Rien à importer",
  "uk": "Нічого імпортувати"
 },
 "Prism needs Full Disk Access to read Safari’s bookmarks and history.": {
  "tr": "Prism’in Safari yer imlerini ve geçmişini okuması için Tam Disk Erişimi gerekiyor.",
  "es": "Prism necesita acceso total al disco para leer los marcadores y el historial de Safari.",
  "pt": "O Prism precisa de acesso total ao disco para ler os favoritos e o histórico do Safari.",
  "fr": "Prism a besoin de l’accès complet au disque pour lire les favoris et l’historique de Safari.",
  "uk": "Prism потрібен повний доступ до диска, щоб читати закладки та історію Safari."
 },
 "Bookmarks, Reading List and history. Passwords come from the Passwords app.": {
  "tr": "Yer imleri, Okuma Listesi ve geçmiş. Parolalar, Parolalar uygulamasından gelir.",
  "es": "Marcadores, Lista de lectura e historial. Las contraseñas vienen de la app Contraseñas.",
  "pt": "Favoritos, Lista de leitura e histórico. As palavras-passe vêm da app Palavras-passe.",
  "fr": "Favoris, liste de lecture et historique. Les mots de passe viennent de l’app Mots de passe.",
  "uk": "Закладки, список читання та історія. Паролі — із застосунку Паролі."
 },
 "Pinned tabs, favorites, folders, passwords and history.": {
  "tr": "Sabitlenmiş sekmeler, favoriler, klasörler, parolalar ve geçmiş.",
  "es": "Pestañas fijadas, favoritos, carpetas, contraseñas e historial.",
  "pt": "Separadores fixados, favoritos, pastas, palavras-passe e histórico.",
  "fr": "Onglets épinglés, favoris, dossiers, mots de passe et historique.",
  "uk": "Закріплені вкладки, вибране, папки, паролі та історія."
 },
 "Bookmarks, passwords and history.": {
  "tr": "Yer imleri, parolalar ve geçmiş.",
  "es": "Marcadores, contraseñas e historial.",
  "pt": "Favoritos, palavras-passe e histórico.",
  "fr": "Favoris, mots de passe et historique.",
  "uk": "Закладки, паролі та історія."
 },
 "No other browsers were found on this Mac. You can still import a bookmarks or password file below.": {
  "tr": "Bu Mac’te başka tarayıcı bulunamadı. Aşağıdan yine de yer imi veya parola dosyası aktarabilirsin.",
  "es": "No se encontraron otros navegadores en este Mac. Aún puedes importar un archivo de marcadores o contraseñas abajo.",
  "pt": "Não foram encontrados outros navegadores neste Mac. Ainda pode importar um ficheiro de favoritos ou palavras-passe abaixo.",
  "fr": "Aucun autre navigateur n’a été trouvé sur ce Mac. Vous pouvez toujours importer un fichier de favoris ou de mots de passe ci-dessous.",
  "uk": "На цьому Mac не знайдено інших браузерів. Ви все одно можете імпортувати файл закладок або паролів нижче."
 },
 "{awake} awake · {sleeping} sleeping": {
  "tr": "{awake} uyanık · {sleeping} uykuda",
  "es": "{awake} activas · {sleeping} en reposo",
  "pt": "{awake} ativos · {sleeping} em repouso",
  "fr": "{awake} actifs · {sleeping} en veille",
  "uk": "{awake} активних · {sleeping} сплять"
 },
 "Browser tabs": {
  "tr": "Tarayıcı sekmeleri",
  "es": "Pestañas del navegador",
  "pt": "Separadores do navegador",
  "fr": "Onglets du navigateur",
  "uk": "Вкладки браузера"
 },
 "Browsing space": {
  "tr": "Gezinme alanı",
  "es": "Espacio de navegación",
  "pt": "Espaço de navegação",
  "fr": "Espace de navigation",
  "uk": "Простір перегляду"
 },
 "Change split layout": {
  "tr": "Bölünmüş düzeni değiştir",
  "es": "Cambiar diseño dividido",
  "pt": "Alterar disposição dividida",
  "fr": "Changer la disposition partagée",
  "uk": "Змінити розділений макет"
 },
 "Choose a saved login": {
  "tr": "Kayıtlı bir giriş seç",
  "es": "Elige un inicio de sesión guardado",
  "pt": "Escolha um início de sessão guardado",
  "fr": "Choisissez un identifiant enregistré",
  "uk": "Виберіть збережений вхід"
 },
 "Close inspector": {
  "tr": "Denetçiyi kapat",
  "es": "Cerrar inspector",
  "pt": "Fechar inspetor",
  "fr": "Fermer l’inspecteur",
  "uk": "Закрити інспектор"
 },
 "Edit saved login": {
  "tr": "Kayıtlı girişi düzenle",
  "es": "Editar inicio de sesión guardado",
  "pt": "Editar início de sessão guardado",
  "fr": "Modifier l’identifiant enregistré",
  "uk": "Редагувати збережений вхід"
 },
 "End split": {
  "tr": "Bölmeyi bitir",
  "es": "Terminar división",
  "pt": "Terminar divisão",
  "fr": "Quitter la vue partagée",
  "uk": "Завершити розділення"
 },
 "Favorite bookmarks": {
  "tr": "Favori yer imleri",
  "es": "Marcadores favoritos",
  "pt": "Favoritos preferidos",
  "fr": "Favoris préférés",
  "uk": "Улюблені закладки"
 },
 "Favorite websites": {
  "tr": "Favori web siteleri",
  "es": "Sitios web favoritos",
  "pt": "Sites favoritos",
  "fr": "Sites favoris",
  "uk": "Улюблені вебсайти"
 },
 "Import Arc data": {
  "tr": "Arc verilerini aktar",
  "es": "Importar datos de Arc",
  "pt": "Importar dados do Arc",
  "fr": "Importer les données d’Arc",
  "uk": "Імпортувати дані Arc"
 },
 "Resize sidebar": {
  "tr": "Kenar çubuğunu yeniden boyutlandır",
  "es": "Cambiar tamaño de la barra lateral",
  "pt": "Redimensionar barra lateral",
  "fr": "Redimensionner la barre latérale",
  "uk": "Змінити розмір бічної панелі"
 },
 "Resize split panes": {
  "tr": "Bölmeleri yeniden boyutlandır",
  "es": "Cambiar tamaño de los paneles",
  "pt": "Redimensionar painéis",
  "fr": "Redimensionner les volets",
  "uk": "Змінити розмір панелей"
 },
 "Second tab": {
  "tr": "İkinci sekme",
  "es": "Segunda pestaña",
  "pt": "Segundo separador",
  "fr": "Deuxième onglet",
  "uk": "Друга вкладка"
 },
 "Settings sections": {
  "tr": "Ayar bölümleri",
  "es": "Secciones de ajustes",
  "pt": "Secções das definições",
  "fr": "Sections des réglages",
  "uk": "Розділи налаштувань"
 },
 "Site to add": {
  "tr": "Eklenecek site",
  "es": "Sitio para añadir",
  "pt": "Site a adicionar",
  "fr": "Site à ajouter",
  "uk": "Сайт для додавання"
 },
 "Split view, tab layout & page tools": {
  "tr": "Bölünmüş görünüm, sekme düzeni ve sayfa araçları",
  "es": "Vista dividida, diseño de pestañas y herramientas",
  "pt": "Vista dividida, disposição de separadores e ferramentas",
  "fr": "Vue partagée, disposition des onglets et outils",
  "uk": "Розділений вигляд, макет вкладок та інструменти"
 },
 "Swap panes": {
  "tr": "Bölmelerin yerini değiştir",
  "es": "Intercambiar paneles",
  "pt": "Trocar painéis",
  "fr": "Échanger les volets",
  "uk": "Поміняти панелі"
 },
 "Tab to rename": {
  "tr": "Yeniden adlandırılacak sekme",
  "es": "Pestaña para renombrar",
  "pt": "Separador a renomear",
  "fr": "Onglet à renommer",
  "uk": "Вкладка для перейменування"
 },
 "Toggle sidebar": {
  "tr": "Kenar çubuğunu göster/gizle",
  "es": "Mostrar u ocultar barra lateral",
  "pt": "Mostrar ou ocultar barra lateral",
  "fr": "Afficher ou masquer la barre latérale",
  "uk": "Показати або сховати бічну панель"
 },
 "Your Prism profile card": {
  "tr": "Prism profil kartın",
  "es": "Tu tarjeta de perfil de Prism",
  "pt": "O seu cartão de perfil Prism",
  "fr": "Votre carte de profil Prism",
  "uk": "Ваша картка профілю Prism"
 },
 "Nothing has been collected or sent.": {
  "tr": "Hiçbir şey toplanmadı veya gönderilmedi.",
  "es": "No se ha recopilado ni enviado nada.",
  "pt": "Nada foi recolhido nem enviado.",
  "fr": "Rien n’a été collecté ni envoyé.",
  "uk": "Нічого не зібрано й не надіслано."
 },
 "Paste API key": {
  "tr": "API anahtarını yapıştır",
  "es": "Pega la clave de API",
  "pt": "Cole a chave de API",
  "fr": "Collez la clé API",
  "uk": "Вставте ключ API"
 },
 "Your name": {
  "tr": "Adın",
  "es": "Tu nombre",
  "pt": "O seu nome",
  "fr": "Votre nom",
  "uk": "Ваше ім’я"
 },
 "Bookmark this page (⌘D)": {
  "tr": "Bu sayfayı yer imlerine ekle (⌘D)",
  "es": "Añadir esta página a marcadores (⌘D)",
  "pt": "Adicionar esta página aos favoritos (⌘D)",
  "fr": "Ajouter cette page aux favoris (⌘D)",
  "uk": "Додати сторінку в закладки (⌘D)"
 },
 "Downloads (⌘J)": {
  "tr": "İndirilenler (⌘J)",
  "es": "Descargas (⌘J)",
  "pt": "Transferências (⌘J)",
  "fr": "Téléchargements (⌘J)",
  "uk": "Завантаження (⌘J)"
 },
 "Settings (⌘,)": {
  "tr": "Ayarlar (⌘,)",
  "es": "Ajustes (⌘,)",
  "pt": "Definições (⌘,)",
  "fr": "Réglages (⌘,)",
  "uk": "Налаштування (⌘,)"
 },
 "This older profile was saved before creation dates were recorded.": {
  "tr": "Bu eski profil, oluşturma tarihleri kaydedilmeye başlanmadan önce kaydedildi.",
  "es": "Este perfil antiguo se guardó antes de que se registraran las fechas de creación.",
  "pt": "Este perfil antigo foi guardado antes de as datas de criação serem registadas.",
  "fr": "Ce profil ancien a été enregistré avant que les dates de création soient conservées.",
  "uk": "Цей старий профіль збережено до того, як почали записувати дати створення."
 },
 "A LITTLE LESS NOISE": {
  "tr": "BİRAZ DAHA AZ GÜRÜLTÜ",
  "es": "UN POCO MENOS DE RUIDO",
  "pt": "UM POUCO MENOS DE RUÍDO",
  "fr": "UN PEU MOINS DE BRUIT",
  "uk": "ТРОХИ МЕНШЕ ШУМУ"
 },
 "Room to": {
  "tr": "Net düşünmek",
  "es": "Espacio para",
  "pt": "Espaço para",
  "fr": "De la place pour",
  "uk": "Простір, щоб"
 },
 "think clearly.": {
  "tr": "için alan.",
  "es": "pensar con claridad.",
  "pt": "pensar com clareza.",
  "fr": "penser clairement.",
  "uk": "ясно мислити."
 },
 "CHROMIUM AT HEART. CLARITY BY DESIGN.": {
  "tr": "ÖZÜNDE CHROMIUM. TASARIMIYLA NETLİK.",
  "es": "CHROMIUM EN EL CORAZÓN. CLARIDAD POR DISEÑO.",
  "pt": "CHROMIUM NO CORAÇÃO. CLAREZA POR DESIGN.",
  "fr": "CHROMIUM AU CŒUR. LA CLARTÉ PAR DESIGN.",
  "uk": "CHROMIUM У СЕРЦІ. ЯСНІСТЬ У ДИЗАЙНІ."
 },
 "A quiet corner of the internet.": {
  "tr": "İnternetin sakin bir köşesi.",
  "es": "Un rincón tranquilo de internet.",
  "pt": "Um canto tranquilo da internet.",
  "fr": "Un coin tranquille d’internet.",
  "uk": "Тихий куточок інтернету."
 },
 "Your tabs, your pace, a lighter workspace.": {
  "tr": "Senin sekmelerin, senin hızın, daha hafif bir çalışma alanı.",
  "es": "Tus pestañas, tu ritmo, un espacio de trabajo más ligero.",
  "pt": "Os seus separadores, o seu ritmo, um espaço de trabalho mais leve.",
  "fr": "Vos onglets, votre rythme, un espace de travail plus léger.",
  "uk": "Ваші вкладки, ваш темп, легший робочий простір."
 },
 "Memory, thoughtfully.": {
  "tr": "Bellek, özenle.",
  "es": "Memoria, con cuidado.",
  "pt": "Memória, com cuidado.",
  "fr": "La mémoire, avec soin.",
  "uk": "Пам’ять, дбайливо."
 },
 "Idle tabs sleep after 5 minutes. Select a sleeping tab to reload it.": {
  "tr": "Boştaki sekmeler 5 dakika sonra uyur. Yeniden yüklemek için uyuyan bir sekmeyi seç.",
  "es": "Las pestañas inactivas reposan tras 5 minutos. Selecciona una pestaña en reposo para recargarla.",
  "pt": "Os separadores inativos repousam após 5 minutos. Selecione um separador em repouso para o recarregar.",
  "fr": "Les onglets inactifs se mettent en veille après 5 minutes. Sélectionnez un onglet en veille pour le recharger.",
  "uk": "Неактивні вкладки засинають через 5 хвилин. Виберіть сплячу вкладку, щоб перезавантажити її."
 },
 "A clearer read": {
  "tr": "Daha net bir okuma",
  "es": "Una lectura más clara",
  "pt": "Uma leitura mais clara",
  "fr": "Une lecture plus claire",
  "uk": "Чистіше читання"
 },
 "A little help, on your terms": {
  "tr": "Biraz yardım, senin koşullarınla",
  "es": "Un poco de ayuda, a tu manera",
  "pt": "Uma pequena ajuda, nos seus termos",
  "fr": "Un peu d’aide, selon vos conditions",
  "uk": "Трохи допомоги, на ваших умовах"
 },
 "A place to go, a thought to follow": {
  "tr": "Gidecek bir yer, izlenecek bir düşünce",
  "es": "Un lugar al que ir, una idea que seguir",
  "pt": "Um lugar para ir, uma ideia para seguir",
  "fr": "Un endroit où aller, une idée à suivre",
  "uk": "Куди піти, за якою думкою йти"
 },
 "A small space that feels like you.": {
  "tr": "Sana benzeyen küçük bir alan.",
  "es": "Un pequeño espacio que se siente tuyo.",
  "pt": "Um pequeno espaço com a sua cara.",
  "fr": "Un petit espace qui vous ressemble.",
  "uk": "Невеликий простір, схожий на вас."
 },
 "A tidier tab list": {
  "tr": "Daha düzenli bir sekme listesi",
  "es": "Una lista de pestañas más ordenada",
  "pt": "Uma lista de separadores mais arrumada",
  "fr": "Une liste d’onglets plus ordonnée",
  "uk": "Охайніший список вкладок"
 },
 "AI providers": {
  "tr": "Yapay zekâ sağlayıcıları",
  "es": "Proveedores de IA",
  "pt": "Fornecedores de IA",
  "fr": "Fournisseurs d’IA",
  "uk": "Постачальники ШІ"
 },
 "API settings": {
  "tr": "API ayarları",
  "es": "Ajustes de API",
  "pt": "Definições da API",
  "fr": "Réglages de l’API",
  "uk": "Налаштування API"
 },
 "Account email": {
  "tr": "Hesap e-postası",
  "es": "Correo de la cuenta",
  "pt": "E-mail da conta",
  "fr": "E-mail du compte",
  "uk": "Електронна пошта облікового запису"
 },
 "Add Gmail to Favorites": {
  "tr": "Gmail’i Favorilere ekle",
  "es": "Añadir Gmail a Favoritos",
  "pt": "Adicionar o Gmail aos Favoritos",
  "fr": "Ajouter Gmail aux favoris",
  "uk": "Додати Gmail до вибраного"
 },
 "Add your email": {
  "tr": "E-postanı ekle",
  "es": "Añade tu correo",
  "pt": "Adicione o seu e-mail",
  "fr": "Ajoutez votre e-mail",
  "uk": "Додайте свою пошту"
 },
 "Apple Intelligence works on device. With Claude or OpenAI, Prism sends only what a feature needs, when you use it: a download’s filename, type and source page title; the page text you preview for a summary or translation; or the sites and page titles of today’s Spectrum chapters. Passwords are never sent. AI features are off in Private.": {
  "tr": "Apple Intelligence cihazda çalışır. Claude veya OpenAI ile Prism yalnızca bir özelliğin ihtiyaç duyduğunu, sen kullandığında gönderir: bir indirmenin dosya adı, türü ve kaynak sayfa başlığı; özet veya çeviri için önizlediğin sayfa metni; ya da bugünkü Spectrum bölümlerinin siteleri ve sayfa başlıkları. Parolalar asla gönderilmez. Gizli modda yapay zekâ özellikleri kapalıdır.",
  "es": "Apple Intelligence funciona en el dispositivo. Con Claude u OpenAI, Prism envía solo lo que necesita una función, cuando la usas: el nombre, tipo y título de la página de origen de una descarga; el texto de la página que previsualizas para un resumen o una traducción; o los sitios y títulos de los capítulos de Spectrum de hoy. Las contraseñas nunca se envían. Las funciones de IA están desactivadas en Privado.",
  "pt": "O Apple Intelligence funciona no dispositivo. Com o Claude ou a OpenAI, o Prism envia apenas o que uma funcionalidade precisa, quando a utiliza: o nome, tipo e título da página de origem de uma transferência; o texto da página que pré-visualiza para um resumo ou tradução; ou os sites e títulos dos capítulos do Spectrum de hoje. As palavras-passe nunca são enviadas. As funcionalidades de IA estão desativadas em Privado.",
  "fr": "Apple Intelligence fonctionne sur l’appareil. Avec Claude ou OpenAI, Prism n’envoie que ce dont une fonction a besoin, quand vous l’utilisez : le nom, le type et le titre de la page source d’un téléchargement ; le texte de page que vous prévisualisez pour un résumé ou une traduction ; ou les sites et titres des chapitres Spectrum du jour. Les mots de passe ne sont jamais envoyés. Les fonctions d’IA sont désactivées en navigation privée.",
  "uk": "Apple Intelligence працює на пристрої. З Claude або OpenAI Prism надсилає лише те, що потрібно функції, коли ви нею користуєтеся: назву, тип і заголовок сторінки джерела завантаження; текст сторінки, який ви переглядаєте для підсумку чи перекладу; або сайти й заголовки сторінок сьогоднішніх розділів Spectrum. Паролі ніколи не надсилаються. У приватному режимі функції ШІ вимкнено."
 },
 "Apple Intelligence · on device": {
  "tr": "Apple Intelligence · cihazda",
  "es": "Apple Intelligence · en el dispositivo",
  "pt": "Apple Intelligence · no dispositivo",
  "fr": "Apple Intelligence · sur l’appareil",
  "uk": "Apple Intelligence · на пристрої"
 },
 "Arrange by site": {
  "tr": "Siteye göre düzenle",
  "es": "Ordenar por sitio",
  "pt": "Organizar por site",
  "fr": "Ranger par site",
  "uk": "Упорядкувати за сайтом"
 },
 "Ask ChatGPT": {
  "tr": "ChatGPT’ye sor",
  "es": "Preguntar a ChatGPT",
  "pt": "Perguntar ao ChatGPT",
  "fr": "Demander à ChatGPT",
  "uk": "Запитати ChatGPT"
 },
 "Automatically rename downloads": {
  "tr": "İndirilenleri otomatik yeniden adlandır",
  "es": "Renombrar descargas automáticamente",
  "pt": "Renomear transferências automaticamente",
  "fr": "Renommer automatiquement les téléchargements",
  "uk": "Автоматично перейменовувати завантаження"
 },
 "Balanced": {
  "tr": "Dengeli",
  "es": "Equilibrado",
  "pt": "Equilibrado",
  "fr": "Équilibré",
  "uk": "Збалансовано"
 },
 "Camera, microphone, location and notifications ask before use. Private blocks these permissions. Reset a choice to ask again; reload the site to stop existing access.": {
  "tr": "Kamera, mikrofon, konum ve bildirimler kullanılmadan önce sorulur. Gizli mod bu izinleri engeller. Yeniden sorulması için bir seçimi sıfırla; mevcut erişimi durdurmak için siteyi yeniden yükle.",
  "es": "La cámara, el micrófono, la ubicación y las notificaciones piden permiso antes de usarse. Privado bloquea estos permisos. Restablece una elección para que vuelva a preguntar; recarga el sitio para detener el acceso actual.",
  "pt": "A câmara, o microfone, a localização e as notificações pedem autorização antes de serem usados. O modo Privado bloqueia estas autorizações. Reponha uma escolha para voltar a perguntar; recarregue o site para parar o acesso atual.",
  "fr": "La caméra, le micro, la position et les notifications demandent l’autorisation avant utilisation. La navigation privée bloque ces autorisations. Réinitialisez un choix pour qu’il soit redemandé ; rechargez le site pour arrêter l’accès en cours.",
  "uk": "Камера, мікрофон, геопозиція та сповіщення запитують дозвіл перед використанням. Приватний режим блокує ці дозволи. Скиньте вибір, щоб запитати знову; перезавантажте сайт, щоб припинити наявний доступ."
 },
 "Check availability on this Mac.": {
  "tr": "Bu Mac’te kullanılabilirliği denetle.",
  "es": "Comprueba la disponibilidad en este Mac.",
  "pt": "Verifique a disponibilidade neste Mac.",
  "fr": "Vérifiez la disponibilité sur ce Mac.",
  "uk": "Перевірте доступність на цьому Mac."
 },
 "Check local beta releases before opening and install newer builds automatically.": {
  "tr": "Açmadan önce yerel beta sürümlerini denetle ve daha yeni derlemeleri otomatik yükle.",
  "es": "Comprobar versiones beta locales antes de abrir e instalar automáticamente compilaciones nuevas.",
  "pt": "Verificar versões beta locais antes de abrir e instalar automaticamente compilações mais recentes.",
  "fr": "Vérifier les versions bêta locales avant l’ouverture et installer automatiquement les nouvelles versions.",
  "uk": "Перевіряти локальні бета-версії перед відкриттям і автоматично встановлювати новіші збірки."
 },
 "Choose how many idle pages stay awake. Media, unsaved forms and protected tabs stay open.": {
  "tr": "Kaç boştaki sayfanın uyanık kalacağını seç. Medya, kaydedilmemiş formlar ve korunan sekmeler açık kalır.",
  "es": "Elige cuántas páginas inactivas siguen activas. El contenido multimedia, los formularios sin guardar y las pestañas protegidas siguen abiertos.",
  "pt": "Escolha quantas páginas inativas ficam ativas. Multimédia, formulários por guardar e separadores protegidos ficam abertos.",
  "fr": "Choisissez combien de pages inactives restent actives. Les médias, les formulaires non enregistrés et les onglets protégés restent ouverts.",
  "uk": "Виберіть, скільки неактивних сторінок залишаються активними. Медіа, незбережені форми та захищені вкладки залишаються відкритими."
 },
 "Clear / cancel": {
  "tr": "Temizle / iptal",
  "es": "Borrar / cancelar",
  "pt": "Limpar / cancelar",
  "fr": "Effacer / annuler",
  "uk": "Очистити / скасувати"
 },
 "Configure API access": {
  "tr": "API erişimini yapılandır",
  "es": "Configurar acceso a la API",
  "pt": "Configurar acesso à API",
  "fr": "Configurer l’accès à l’API",
  "uk": "Налаштувати доступ до API"
 },
 "Confirm account email to delete": {
  "tr": "Silmek için hesap e-postasını onayla",
  "es": "Confirma el correo de la cuenta para eliminarla",
  "pt": "Confirme o e-mail da conta para eliminar",
  "fr": "Confirmez l’e-mail du compte pour le supprimer",
  "uk": "Підтвердьте пошту облікового запису, щоб видалити"
 },
 "Context": {
  "tr": "Bağlam",
  "es": "Contexto",
  "pt": "Contexto",
  "fr": "Contexte",
  "uk": "Контекст"
 },
 "Cool blue · clear and quiet": {
  "tr": "Serin mavi · net ve sakin",
  "es": "Azul fresco · claro y tranquilo",
  "pt": "Azul fresco · claro e tranquilo",
  "fr": "Bleu frais · clair et calme",
  "uk": "Прохолодний синій · чисто й тихо"
 },
 "Copy result": {
  "tr": "Sonucu kopyala",
  "es": "Copiar resultado",
  "pt": "Copiar resultado",
  "fr": "Copier le résultat",
  "uk": "Копіювати результат"
 },
 "Create a shortcut with an Open URLs action using one of these addresses. Name it, then ask Siri to run that name. Prism must be installed in Applications.": {
  "tr": "Bu adreslerden biriyle URL’leri Aç eylemi içeren bir kestirme oluştur. Ona bir ad ver, sonra Siri’den o adı çalıştırmasını iste. Prism, Uygulamalar klasöründe yüklü olmalıdır.",
  "es": "Crea un atajo con la acción Abrir URL usando una de estas direcciones. Ponle un nombre y pide a Siri que lo ejecute. Prism debe estar instalado en Aplicaciones.",
  "pt": "Crie um atalho com a ação Abrir URL usando um destes endereços. Dê-lhe um nome e peça à Siri para o executar. O Prism tem de estar instalado em Aplicações.",
  "fr": "Créez un raccourci avec l’action Ouvrir les URL en utilisant l’une de ces adresses. Nommez-le, puis demandez à Siri de l’exécuter. Prism doit être installé dans Applications.",
  "uk": "Створіть швидку команду з дією «Відкрити URL» з однією з цих адрес. Назвіть її й попросіть Siri виконати цю назву. Prism має бути встановлено в Програми."
 },
 "Ctrl ⇧ C copies the current URL. Picture-in-picture uses the existing video player; some sites restrict it.": {
  "tr": "Ctrl ⇧ C geçerli URL’yi kopyalar. Resim içinde resim mevcut video oynatıcıyı kullanır; bazı siteler bunu kısıtlar.",
  "es": "Ctrl ⇧ C copia la URL actual. Imagen dentro de imagen usa el reproductor de vídeo existente; algunos sitios lo restringen.",
  "pt": "Ctrl ⇧ C copia o URL atual. A imagem na imagem usa o leitor de vídeo existente; alguns sites restringem-na.",
  "fr": "Ctrl ⇧ C copie l’URL actuelle. L’image dans l’image utilise le lecteur vidéo existant ; certains sites la limitent.",
  "uk": "Ctrl ⇧ C копіює поточну URL-адресу. «Картинка в картинці» використовує наявний відеоплеєр; деякі сайти це обмежують."
 },
 "Delete account…": {
  "tr": "Hesabı sil…",
  "es": "Eliminar cuenta…",
  "pt": "Eliminar conta…",
  "fr": "Supprimer le compte…",
  "uk": "Видалити обліковий запис…"
 },
 "Delete server account": {
  "tr": "Sunucu hesabını sil",
  "es": "Eliminar cuenta del servidor",
  "pt": "Eliminar conta do servidor",
  "fr": "Supprimer le compte serveur",
  "uk": "Видалити обліковий запис на сервері"
 },
 "Development inbox code": {
  "tr": "Geliştirme gelen kutusu kodu",
  "es": "Código de la bandeja de desarrollo",
  "pt": "Código da caixa de desenvolvimento",
  "fr": "Code de la boîte de développement",
  "uk": "Код тестової скриньки"
 },
 "Development server on this Mac. No email is sent; iPhone sync is not connected. Only your name and theme are transferred when you choose.": {
  "tr": "Bu Mac’te geliştirme sunucusu. E-posta gönderilmez; iPhone eşzamanlaması bağlı değil. Yalnızca sen seçtiğinde adın ve teman aktarılır.",
  "es": "Servidor de desarrollo en este Mac. No se envía ningún correo; la sincronización con el iPhone no está conectada. Solo se transfieren tu nombre y tema cuando lo eliges.",
  "pt": "Servidor de desenvolvimento neste Mac. Não é enviado nenhum e-mail; a sincronização com o iPhone não está ligada. Só o seu nome e tema são transferidos quando escolher.",
  "fr": "Serveur de développement sur ce Mac. Aucun e-mail n’est envoyé ; la synchronisation avec l’iPhone n’est pas connectée. Seuls votre nom et votre thème sont transférés lorsque vous le choisissez.",
  "uk": "Сервер розробки на цьому Mac. Листи не надсилаються; синхронізацію з iPhone не підключено. Лише ваше ім’я та тема передаються, коли ви це обираєте."
 },
 "Devices": {
  "tr": "Cihazlar",
  "es": "Dispositivos",
  "pt": "Dispositivos",
  "fr": "Appareils",
  "uk": "Пристрої"
 },
 "Display name": {
  "tr": "Görünen ad",
  "es": "Nombre visible",
  "pt": "Nome a apresentar",
  "fr": "Nom affiché",
  "uk": "Відображуване ім’я"
 },
 "Email": {
  "tr": "E-posta",
  "es": "Correo",
  "pt": "E-mail",
  "fr": "E-mail",
  "uk": "Електронна пошта"
 },
 "Export account": {
  "tr": "Hesabı dışa aktar",
  "es": "Exportar cuenta",
  "pt": "Exportar conta",
  "fr": "Exporter le compte",
  "uk": "Експортувати обліковий запис"
 },
 "Favorite theme": {
  "tr": "Favori tema",
  "es": "Tema favorito",
  "pt": "Tema favorito",
  "fr": "Thème favori",
  "uk": "Улюблена тема"
 },
 "Filters ship with Prism updates. No browsing log or background list requests. Private site exceptions are temporary.": {
  "tr": "Filtreler Prism güncellemeleriyle gelir. Gezinme kaydı veya arka planda liste isteği yoktur. Gizli moddaki site istisnaları geçicidir.",
  "es": "Los filtros llegan con las actualizaciones de Prism. Sin registro de navegación ni solicitudes de listas en segundo plano. Las excepciones de sitios en Privado son temporales.",
  "pt": "Os filtros chegam com as atualizações do Prism. Sem registo de navegação nem pedidos de listas em segundo plano. As exceções de sites em Privado são temporárias.",
  "fr": "Les filtres sont fournis avec les mises à jour de Prism. Aucun journal de navigation ni requête de liste en arrière-plan. Les exceptions de site en navigation privée sont temporaires.",
  "uk": "Фільтри постачаються з оновленнями Prism. Без журналу перегляду та фонових запитів списків. Винятки сайтів у приватному режимі тимчасові."
 },
 "French": {
  "tr": "Fransızca",
  "es": "Francés",
  "pt": "Francês",
  "fr": "Français",
  "uk": "Французька"
 },
 "Portuguese": {
  "tr": "Portekizce",
  "es": "Portugués",
  "pt": "Português",
  "fr": "Portugais",
  "uk": "Португальська"
 },
 "Spanish": {
  "tr": "İspanyolca",
  "es": "Español",
  "pt": "Espanhol",
  "fr": "Espagnol",
  "uk": "Іспанська"
 },
 "Turkish": {
  "tr": "Türkçe",
  "es": "Turco",
  "pt": "Turco",
  "fr": "Turc",
  "uk": "Турецька"
 },
 "Ukrainian": {
  "tr": "Ukraynaca",
  "es": "Ucraniano",
  "pt": "Ucraniano",
  "fr": "Ukrainien",
  "uk": "Українська"
 },
 "Gmail favorite preview": {
  "tr": "Gmail favori önizlemesi",
  "es": "Vista previa del favorito de Gmail",
  "pt": "Pré-visualização do favorito Gmail",
  "fr": "Aperçu du favori Gmail",
  "uk": "Попередній перегляд Gmail у вибраному"
 },
 "Horizontal divider": {
  "tr": "Yatay ayırıcı",
  "es": "Divisor horizontal",
  "pt": "Divisor horizontal",
  "fr": "Séparateur horizontal",
  "uk": "Горизонтальний роздільник"
 },
 "Vertical divider": {
  "tr": "Dikey ayırıcı",
  "es": "Divisor vertical",
  "pt": "Divisor vertical",
  "fr": "Séparateur vertical",
  "uk": "Вертикальний роздільник"
 },
 "Inspect HTML & CSS": {
  "tr": "HTML ve CSS’i incele",
  "es": "Inspeccionar HTML y CSS",
  "pt": "Inspecionar HTML e CSS",
  "fr": "Inspecter le HTML et le CSS",
  "uk": "Перевірити HTML і CSS"
 },
 "Keep the original name if AI is unavailable. Private downloads are excluded.": {
  "tr": "Yapay zekâ kullanılamazsa özgün ad korunur. Gizli indirmeler hariçtir.",
  "es": "Se conserva el nombre original si la IA no está disponible. Las descargas privadas quedan excluidas.",
  "pt": "O nome original mantém-se se a IA não estiver disponível. As transferências privadas são excluídas.",
  "fr": "Le nom d’origine est conservé si l’IA n’est pas disponible. Les téléchargements privés sont exclus.",
  "uk": "Якщо ШІ недоступний, зберігається оригінальна назва. Приватні завантаження виключено."
 },
 "Keeps every tab open. Favorites and pinned tabs stay in place.": {
  "tr": "Her sekmeyi açık tutar. Favoriler ve sabitlenmiş sekmeler yerinde kalır.",
  "es": "Mantiene todas las pestañas abiertas. Los favoritos y las pestañas fijadas no se mueven.",
  "pt": "Mantém todos os separadores abertos. Os favoritos e os separadores fixados ficam no lugar.",
  "fr": "Garde chaque onglet ouvert. Les favoris et les onglets épinglés restent en place.",
  "uk": "Залишає всі вкладки відкритими. Вибране й закріплені вкладки залишаються на місці."
 },
 "Lavender · after hours": {
  "tr": "Lavanta · mesai sonrası",
  "es": "Lavanda · fuera de horario",
  "pt": "Lavanda · depois de horas",
  "fr": "Lavande · après le travail",
  "uk": "Лаванда · після роботи"
 },
 "Layout": {
  "tr": "Düzen",
  "es": "Diseño",
  "pt": "Disposição",
  "fr": "Disposition",
  "uk": "Макет"
 },
 "Live resources": {
  "tr": "Canlı kaynaklar",
  "es": "Recursos en vivo",
  "pt": "Recursos em tempo real",
  "fr": "Ressources en direct",
  "uk": "Ресурси наживо"
 },
 "Local encrypted vault": {
  "tr": "Yerel şifreli kasa",
  "es": "Bóveda cifrada local",
  "pt": "Cofre encriptado local",
  "fr": "Coffre chiffré local",
  "uk": "Локальне зашифроване сховище"
 },
 "Local preview": {
  "tr": "Yerel önizleme",
  "es": "Vista previa local",
  "pt": "Pré-visualização local",
  "fr": "Aperçu local",
  "uk": "Локальний перегляд"
 },
 "Low memory": {
  "tr": "Düşük bellek",
  "es": "Poca memoria",
  "pt": "Pouca memória",
  "fr": "Mémoire faible",
  "uk": "Мало пам’яті"
 },
 "Memory balance": {
  "tr": "Bellek dengesi",
  "es": "Equilibrio de memoria",
  "pt": "Equilíbrio de memória",
  "fr": "Équilibre de la mémoire",
  "uk": "Баланс пам’яті"
 },
 "Muted pink · a warmer day": {
  "tr": "Soluk pembe · daha sıcak bir gün",
  "es": "Rosa suave · un día más cálido",
  "pt": "Rosa suave · um dia mais quente",
  "fr": "Rose doux · une journée plus chaleureuse",
  "uk": "Приглушений рожевий · тепліший день"
 },
 "Native frosted glass": {
  "tr": "Yerel buzlu cam",
  "es": "Vidrio esmerilado nativo",
  "pt": "Vidro fosco nativo",
  "fr": "Verre dépoli natif",
  "uk": "Нативне матове скло"
 },
 "Neutral · room to focus": {
  "tr": "Nötr · odaklanmak için alan",
  "es": "Neutro · espacio para concentrarse",
  "pt": "Neutro · espaço para se concentrar",
  "fr": "Neutre · de la place pour se concentrer",
  "uk": "Нейтральний · простір для зосередження"
 },
 "New Prism Tab": {
  "tr": "Yeni Prism Sekmesi",
  "es": "Nueva pestaña de Prism",
  "pt": "Novo separador Prism",
  "fr": "Nouvel onglet Prism",
  "uk": "Нова вкладка Prism"
 },
 "Normal tabs keep recent back/forward history and scroll position across restarts. Private tabs and form contents are excluded.": {
  "tr": "Normal sekmeler, yeniden başlatmalarda son geri/ileri geçmişini ve kaydırma konumunu korur. Gizli sekmeler ve form içerikleri hariçtir.",
  "es": "Las pestañas normales conservan el historial reciente de atrás/adelante y la posición de desplazamiento entre reinicios. Se excluyen las pestañas privadas y el contenido de formularios.",
  "pt": "Os separadores normais mantêm o histórico recente de retroceder/avançar e a posição de deslocamento entre reinícios. Os separadores privados e o conteúdo de formulários são excluídos.",
  "fr": "Les onglets normaux conservent l’historique récent précédent/suivant et la position de défilement après un redémarrage. Les onglets privés et le contenu des formulaires sont exclus.",
  "uk": "Звичайні вкладки зберігають недавню історію назад/вперед і позицію прокручування після перезапуску. Приватні вкладки та вміст форм виключено."
 },
 "Not recorded": {
  "tr": "Kaydedilmedi",
  "es": "No registrado",
  "pt": "Não registado",
  "fr": "Non enregistré",
  "uk": "Не записано"
 },
 "Open a store listing and choose Add to Chrome, then review the requested access. Use the Extensions button for quick toggles, or open extension popups below. Tabs, actions, context menus, cookies, and content scripts are supported; compatibility varies. Extensions that depend on native desktop helpers may not work; Apple Passwords cannot connect to its helper in this build. Updates are manual: remove and reinstall from the store.": {
  "tr": "Mağazada bir eklenti sayfası aç ve Chrome’a Ekle’yi seç, sonra istenen erişimi gözden geçir. Hızlı açıp kapatmak için Uzantılar düğmesini kullan veya aşağıdan uzantı açılır pencerelerini aç. Sekmeler, eylemler, bağlam menüleri, çerezler ve içerik betikleri desteklenir; uyumluluk değişebilir. Yerel masaüstü yardımcılarına dayanan uzantılar çalışmayabilir; Apple Parolalar bu derlemede yardımcısına bağlanamaz. Güncellemeler elle yapılır: mağazadan kaldırıp yeniden yükle.",
  "es": "Abre una ficha de la tienda y elige Añadir a Chrome; después revisa el acceso solicitado. Usa el botón Extensiones para activarlas rápidamente o abre sus ventanas emergentes abajo. Se admiten pestañas, acciones, menús contextuales, cookies y scripts de contenido; la compatibilidad varía. Las extensiones que dependen de ayudantes nativos de escritorio pueden no funcionar; Contraseñas de Apple no puede conectarse a su ayudante en esta versión. Las actualizaciones son manuales: elimina y vuelve a instalar desde la tienda.",
  "pt": "Abra uma página da loja e escolha Adicionar ao Chrome; depois reveja o acesso pedido. Use o botão Extensões para ativar rapidamente ou abra as janelas das extensões abaixo. Separadores, ações, menus de contexto, cookies e scripts de conteúdo são suportados; a compatibilidade varia. Extensões que dependem de auxiliares nativos de secretária podem não funcionar; as Palavras-passe da Apple não conseguem ligar-se ao seu auxiliar nesta versão. As atualizações são manuais: remova e reinstale a partir da loja.",
  "fr": "Ouvrez une fiche du store et choisissez Ajouter à Chrome, puis vérifiez l’accès demandé. Utilisez le bouton Extensions pour les activer rapidement, ou ouvrez leurs fenêtres ci-dessous. Les onglets, actions, menus contextuels, cookies et scripts de contenu sont pris en charge ; la compatibilité varie. Les extensions qui dépendent d’assistants natifs peuvent ne pas fonctionner ; Mots de passe d’Apple ne peut pas se connecter à son assistant dans cette version. Les mises à jour sont manuelles : supprimez puis réinstallez depuis le store.",
  "uk": "Відкрийте сторінку в магазині й виберіть «Додати в Chrome», потім перегляньте запитаний доступ. Кнопка «Розширення» вмикає їх швидко, а нижче можна відкрити їхні спливні вікна. Підтримуються вкладки, дії, контекстні меню, cookie та скрипти вмісту; сумісність різниться. Розширення, що залежать від нативних помічників, можуть не працювати; Паролі Apple не можуть підключитися до свого помічника в цій збірці. Оновлення вручну: видаліть і встановіть знову з магазину."
 },
 "Open inbox": {
  "tr": "Gelen kutusunu aç",
  "es": "Abrir bandeja de entrada",
  "pt": "Abrir caixa de entrada",
  "fr": "Ouvrir la boîte de réception",
  "uk": "Відкрити вхідні"
 },
 "Open split view": {
  "tr": "Bölünmüş görünümü aç",
  "es": "Abrir vista dividida",
  "pt": "Abrir vista dividida",
  "fr": "Ouvrir la vue partagée",
  "uk": "Відкрити розділений вигляд"
 },
 "Open this page to measure Prism.": {
  "tr": "Prism’i ölçmek için bu sayfayı aç.",
  "es": "Abre esta página para medir Prism.",
  "pt": "Abra esta página para medir o Prism.",
  "fr": "Ouvrez cette page pour mesurer Prism.",
  "uk": "Відкрийте цю сторінку, щоб виміряти Prism."
 },
 "Open your signed-in website": {
  "tr": "Oturum açtığın web sitesini aç",
  "es": "Abre el sitio web con tu sesión iniciada",
  "pt": "Abra o site com sessão iniciada",
  "fr": "Ouvrez le site où vous êtes connecté",
  "uk": "Відкрийте сайт, де ви ввійшли"
 },
 "OpenAI API key": {
  "tr": "OpenAI API anahtarı",
  "es": "Clave de API de OpenAI",
  "pt": "Chave de API da OpenAI",
  "fr": "Clé API OpenAI",
  "uk": "Ключ API OpenAI"
 },
 "OpenAI · your API key": {
  "tr": "OpenAI · senin API anahtarın",
  "es": "OpenAI · tu clave de API",
  "pt": "OpenAI · a sua chave de API",
  "fr": "OpenAI · votre clé API",
  "uk": "OpenAI · ваш ключ API"
 },
 "Output language": {
  "tr": "Çıktı dili",
  "es": "Idioma de salida",
  "pt": "Idioma de saída",
  "fr": "Langue de sortie",
  "uk": "Мова результату"
 },
 "Page excerpt": {
  "tr": "Sayfa alıntısı",
  "es": "Extracto de la página",
  "pt": "Excerto da página",
  "fr": "Extrait de la page",
  "uk": "Уривок сторінки"
 },
 "Pair the current page with": {
  "tr": "Geçerli sayfayı şununla eşle",
  "es": "Emparejar la página actual con",
  "pt": "Emparelhar a página atual com",
  "fr": "Associer la page actuelle à",
  "uk": "Поєднати поточну сторінку з"
 },
 "Personal and Work use your normal connection.": {
  "tr": "Kişisel ve İş normal bağlantını kullanır.",
  "es": "Personal y Trabajo usan tu conexión normal.",
  "pt": "Pessoal e Trabalho usam a sua ligação normal.",
  "fr": "Personnel et Travail utilisent votre connexion habituelle.",
  "uk": "Особисте й Робота використовують ваше звичайне з’єднання."
 },
 "Personal profile": {
  "tr": "Kişisel profil",
  "es": "Perfil personal",
  "pt": "Perfil pessoal",
  "fr": "Profil personnel",
  "uk": "Особистий профіль"
 },
 "Personal space": {
  "tr": "Kişisel alan",
  "es": "Espacio personal",
  "pt": "Espaço pessoal",
  "fr": "Espace personnel",
  "uk": "Особистий простір"
 },
 "Picture in picture": {
  "tr": "Resim içinde resim",
  "es": "Imagen dentro de imagen",
  "pt": "Imagem na imagem",
  "fr": "Image dans l’image",
  "uk": "Картинка в картинці"
 },
 "Preview context": {
  "tr": "Bağlamı önizle",
  "es": "Previsualizar contexto",
  "pt": "Pré-visualizar contexto",
  "fr": "Aperçu du contexte",
  "uk": "Переглянути контекст"
 },
 "Prism account": {
  "tr": "Prism hesabı",
  "es": "Cuenta de Prism",
  "pt": "Conta Prism",
  "fr": "Compte Prism",
  "uk": "Обліковий запис Prism"
 },
 "Prism Downloads": {
  "tr": "Prism İndirilenler",
  "es": "Descargas de Prism",
  "pt": "Transferências do Prism",
  "fr": "Téléchargements Prism",
  "uk": "Завантаження Prism"
 },
 "Process memory estimates can count shared memory more than once.": {
  "tr": "İşlem belleği tahminleri paylaşılan belleği birden fazla sayabilir.",
  "es": "Las estimaciones de memoria por proceso pueden contar la memoria compartida más de una vez.",
  "pt": "As estimativas de memória por processo podem contar a memória partilhada mais de uma vez.",
  "fr": "Les estimations de mémoire par processus peuvent compter la mémoire partagée plusieurs fois.",
  "uk": "Оцінки пам’яті процесів можуть враховувати спільну пам’ять кілька разів."
 },
 "Profile created": {
  "tr": "Profil oluşturuldu",
  "es": "Perfil creado",
  "pt": "Perfil criado",
  "fr": "Profil créé",
  "uk": "Профіль створено"
 },
 "Provider: OpenAI · gpt-4.1-mini. Sends the preview and site origin only when you press Send. Website text may contain personal information; review it first. API charges may apply. No page text is saved by Prism.": {
  "tr": "Sağlayıcı: OpenAI · gpt-4.1-mini. Önizlemeyi ve site kaynağını yalnızca Gönder’e bastığında gönderir. Web sitesi metni kişisel bilgi içerebilir; önce gözden geçir. API ücretleri uygulanabilir. Prism hiçbir sayfa metnini kaydetmez.",
  "es": "Proveedor: OpenAI · gpt-4.1-mini. Envía la vista previa y el origen del sitio solo cuando pulsas Enviar. El texto del sitio puede contener información personal; revísalo antes. Pueden aplicarse cargos de API. Prism no guarda texto de la página.",
  "pt": "Fornecedor: OpenAI · gpt-4.1-mini. Envia a pré-visualização e a origem do site apenas quando premir Enviar. O texto do site pode conter informações pessoais; reveja-o primeiro. Podem aplicar-se custos da API. O Prism não guarda texto da página.",
  "fr": "Fournisseur : OpenAI · gpt-4.1-mini. Envoie l’aperçu et l’origine du site uniquement lorsque vous appuyez sur Envoyer. Le texte du site peut contenir des informations personnelles ; vérifiez-le d’abord. Des frais d’API peuvent s’appliquer. Prism n’enregistre aucun texte de page.",
  "uk": "Постачальник: OpenAI · gpt-4.1-mini. Надсилає попередній перегляд і джерело сайту лише після натискання «Надіслати». Текст сайту може містити особисту інформацію; спершу перегляньте його. Може стягуватися плата за API. Prism не зберігає текст сторінок."
 },
 "Refresh account": {
  "tr": "Hesabı yenile",
  "es": "Actualizar cuenta",
  "pt": "Atualizar conta",
  "fr": "Actualiser le compte",
  "uk": "Оновити обліковий запис"
 },
 "Release idle memory & disposable cache": {
  "tr": "Boştaki belleği ve atılabilir önbelleği boşalt",
  "es": "Liberar memoria inactiva y caché desechable",
  "pt": "Libertar memória inativa e cache descartável",
  "fr": "Libérer la mémoire inactive et le cache jetable",
  "uk": "Звільнити неактивну пам’ять і тимчасовий кеш"
 },
 "Removes the server profile and all device sessions. Your local browser data stays on this Mac.": {
  "tr": "Sunucu profilini ve tüm cihaz oturumlarını kaldırır. Yerel tarayıcı verilerin bu Mac’te kalır.",
  "es": "Elimina el perfil del servidor y todas las sesiones de dispositivos. Tus datos locales del navegador se quedan en este Mac.",
  "pt": "Remove o perfil do servidor e todas as sessões de dispositivos. Os dados locais do navegador ficam neste Mac.",
  "fr": "Supprime le profil serveur et toutes les sessions d’appareils. Vos données locales restent sur ce Mac.",
  "uk": "Видаляє профіль на сервері та всі сеанси пристроїв. Локальні дані браузера залишаються на цьому Mac."
 },
 "Result preview": {
  "tr": "Sonuç önizlemesi",
  "es": "Vista previa del resultado",
  "pt": "Pré-visualização do resultado",
  "fr": "Aperçu du résultat",
  "uk": "Попередній перегляд результату"
 },
 "Reveal saved password": {
  "tr": "Kayıtlı parolayı göster",
  "es": "Mostrar contraseña guardada",
  "pt": "Mostrar palavra-passe guardada",
  "fr": "Afficher le mot de passe enregistré",
  "uk": "Показати збережений пароль"
 },
 "Room for two": {
  "tr": "İkisine de yer",
  "es": "Espacio para dos",
  "pt": "Espaço para dois",
  "fr": "De la place pour deux",
  "uk": "Місце для двох"
 },
 "Save name": {
  "tr": "Adı kaydet",
  "es": "Guardar nombre",
  "pt": "Guardar nome",
  "fr": "Enregistrer le nom",
  "uk": "Зберегти назву"
 },
 "Save profile & theme": {
  "tr": "Profili ve temayı kaydet",
  "es": "Guardar perfil y tema",
  "pt": "Guardar perfil e tema",
  "fr": "Enregistrer le profil et le thème",
  "uk": "Зберегти профіль і тему"
 },
 "Selected text": {
  "tr": "Seçili metin",
  "es": "Texto seleccionado",
  "pt": "Texto selecionado",
  "fr": "Texte sélectionné",
  "uk": "Виділений текст"
 },
 "Send to OpenAI": {
  "tr": "OpenAI’ye gönder",
  "es": "Enviar a OpenAI",
  "pt": "Enviar para a OpenAI",
  "fr": "Envoyer à OpenAI",
  "uk": "Надіслати в OpenAI"
 },
 "Show the top three messages from your loaded Gmail inbox on hover. No background mail polling.": {
  "tr": "Üzerine gelindiğinde yüklü Gmail gelen kutundaki ilk üç iletiyi göster. Arka planda posta denetimi yapılmaz.",
  "es": "Mostrar al pasar el cursor los tres primeros mensajes de tu bandeja de Gmail cargada. Sin consultas de correo en segundo plano.",
  "pt": "Mostrar ao passar o cursor as três primeiras mensagens da caixa do Gmail carregada. Sem verificação de correio em segundo plano.",
  "fr": "Afficher au survol les trois premiers messages de votre boîte Gmail chargée. Aucune relève du courrier en arrière-plan.",
  "uk": "Показувати при наведенні три перші листи з відкритої скриньки Gmail. Без фонової перевірки пошти."
 },
 "Side by side": {
  "tr": "Yan yana",
  "es": "En paralelo",
  "pt": "Lado a lado",
  "fr": "Côte à côte",
  "uk": "Поруч"
 },
 "Top & bottom": {
  "tr": "Üst ve alt",
  "es": "Arriba y abajo",
  "pt": "Em cima e em baixo",
  "fr": "Haut et bas",
  "uk": "Зверху й знизу"
 },
 "Sign in": {
  "tr": "Oturum aç",
  "es": "Iniciar sesión",
  "pt": "Iniciar sessão",
  "fr": "Se connecter",
  "uk": "Увійти"
 },
 "Sign out": {
  "tr": "Oturumu kapat",
  "es": "Cerrar sesión",
  "pt": "Terminar sessão",
  "fr": "Se déconnecter",
  "uk": "Вийти"
 },
 "Siri & Shortcuts": {
  "tr": "Siri ve Kestirmeler",
  "es": "Siri y Atajos",
  "pt": "Siri e Atalhos",
  "fr": "Siri et Raccourcis",
  "uk": "Siri та Швидкі команди"
 },
 "Soft green · a little calmer": {
  "tr": "Yumuşak yeşil · biraz daha sakin",
  "es": "Verde suave · un poco más calmado",
  "pt": "Verde suave · um pouco mais calmo",
  "fr": "Vert doux · un peu plus calme",
  "uk": "М’який зелений · трохи спокійніше"
 },
 "Warm earth · easy on the eyes": {
  "tr": "Sıcak toprak · gözü yormaz",
  "es": "Tierra cálida · descansa la vista",
  "pt": "Terra quente · suave para os olhos",
  "fr": "Terre chaude · reposant pour les yeux",
  "uk": "Тепла земля · приємно для очей"
 },
 "Split": {
  "tr": "Böl",
  "es": "Dividir",
  "pt": "Dividir",
  "fr": "Partager",
  "uk": "Розділити"
 },
 "Stored encrypted on this Mac. API access is separate from the ChatGPT app.": {
  "tr": "Bu Mac’te şifreli saklanır. API erişimi ChatGPT uygulamasından ayrıdır.",
  "es": "Se guarda cifrada en este Mac. El acceso a la API es independiente de la app ChatGPT.",
  "pt": "Guardada encriptada neste Mac. O acesso à API é separado da app ChatGPT.",
  "fr": "Stockée chiffrée sur ce Mac. L’accès à l’API est distinct de l’app ChatGPT.",
  "uk": "Зберігається зашифрованим на цьому Mac. Доступ до API окремий від застосунку ChatGPT."
 },
 "Stored on this Mac. Your profile email is a label, not a signed-in account.": {
  "tr": "Bu Mac’te saklanır. Profil e-postan bir etikettir, oturum açılmış bir hesap değildir.",
  "es": "Se guarda en este Mac. El correo de tu perfil es una etiqueta, no una cuenta con sesión iniciada.",
  "pt": "Guardado neste Mac. O e-mail do perfil é uma etiqueta, não uma conta com sessão iniciada.",
  "fr": "Stocké sur ce Mac. L’e-mail de votre profil est une étiquette, pas un compte connecté.",
  "uk": "Зберігається на цьому Mac. Пошта профілю — це мітка, а не обліковий запис із входом."
 },
 "Summarize": {
  "tr": "Özetle",
  "es": "Resumir",
  "pt": "Resumir",
  "fr": "Résumer",
  "uk": "Підсумувати"
 },
 "Summarize a page or translate selected text. Preview first, then choose what to send.": {
  "tr": "Bir sayfayı özetle veya seçili metni çevir. Önce önizle, sonra neyin gönderileceğini seç.",
  "es": "Resume una página o traduce el texto seleccionado. Previsualiza primero y luego elige qué enviar.",
  "pt": "Resuma uma página ou traduza o texto selecionado. Pré-visualize primeiro e depois escolha o que enviar.",
  "fr": "Résumez une page ou traduisez le texte sélectionné. Prévisualisez d’abord, puis choisissez ce qui est envoyé.",
  "uk": "Підсумуйте сторінку або перекладіть виділений текст. Спершу перегляньте, потім виберіть, що надіслати."
 },
 "Swap": {
  "tr": "Yer değiştir",
  "es": "Intercambiar",
  "pt": "Trocar",
  "fr": "Échanger",
  "uk": "Поміняти"
 },
 "Text to send": {
  "tr": "Gönderilecek metin",
  "es": "Texto para enviar",
  "pt": "Texto a enviar",
  "fr": "Texte à envoyer",
  "uk": "Текст для надсилання"
 },
 "Translate selection": {
  "tr": "Seçimi çevir",
  "es": "Traducir selección",
  "pt": "Traduzir seleção",
  "fr": "Traduire la sélection",
  "uk": "Перекласти виділене"
 },
 "Two live tabs. One workspace.": {
  "tr": "İki canlı sekme. Tek çalışma alanı.",
  "es": "Dos pestañas activas. Un espacio de trabajo.",
  "pt": "Dois separadores ativos. Um espaço de trabalho.",
  "fr": "Deux onglets actifs. Un espace de travail.",
  "uk": "Дві активні вкладки. Один робочий простір."
 },
 "Undo arrangement": {
  "tr": "Düzenlemeyi geri al",
  "es": "Deshacer organización",
  "pt": "Anular organização",
  "fr": "Annuler le rangement",
  "uk": "Скасувати впорядкування"
 },
 "Undo password import": {
  "tr": "Parola aktarımını geri al",
  "es": "Deshacer importación de contraseñas",
  "pt": "Anular importação de palavras-passe",
  "fr": "Annuler l’import des mots de passe",
  "uk": "Скасувати імпорт паролів"
 },
 "Upload local name & theme": {
  "tr": "Yerel adı ve temayı yükle",
  "es": "Subir nombre y tema locales",
  "pt": "Enviar nome e tema locais",
  "fr": "Envoyer le nom et le thème locaux",
  "uk": "Вивантажити локальні ім’я та тему"
 },
 "Use account profile on this Mac": {
  "tr": "Hesap profilini bu Mac’te kullan",
  "es": "Usar el perfil de la cuenta en este Mac",
  "pt": "Usar o perfil da conta neste Mac",
  "fr": "Utiliser le profil du compte sur ce Mac",
  "uk": "Використати профіль облікового запису на цьому Mac"
 },
 "Use your browser sign-in": {
  "tr": "Tarayıcı oturumunu kullan",
  "es": "Usa tu sesión del navegador",
  "pt": "Use a sessão do navegador",
  "fr": "Utilisez votre connexion du navigateur",
  "uk": "Використайте вхід у браузері"
 },
 "Username": {
  "tr": "Kullanıcı adı",
  "es": "Nombre de usuario",
  "pt": "Nome de utilizador",
  "fr": "Nom d’utilisateur",
  "uk": "Ім’я користувача"
 },
 "Website": {
  "tr": "Web sitesi",
  "es": "Sitio web",
  "pt": "Site",
  "fr": "Site web",
  "uk": "Вебсайт"
 },
 "Your connections": {
  "tr": "Bağlantıların",
  "es": "Tus conexiones",
  "pt": "As suas ligações",
  "fr": "Vos connexions",
  "uk": "Ваші підключення"
 },
 "Your profile": {
  "tr": "Profilin",
  "es": "Tu perfil",
  "pt": "O seu perfil",
  "fr": "Votre profil",
  "uk": "Ваш профіль"
 },
 "Create test sign-in": {
  "tr": "Test girişi oluştur",
  "es": "Crear inicio de sesión de prueba",
  "pt": "Criar início de sessão de teste",
  "fr": "Créer un identifiant de test",
  "uk": "Створити тестовий вхід"
 },
 "Permissions": {
  "tr": "İzinler",
  "es": "Permisos",
  "pt": "Permissões",
  "fr": "Autorisations",
  "uk": "Дозволи"
 },
 "This site": {
  "tr": "Bu site",
  "es": "Este sitio",
  "pt": "Este site",
  "fr": "Ce site",
  "uk": "Цей сайт"
 },
 "Connection is secure": {
  "tr": "Bağlantı güvenli",
  "es": "La conexión es segura",
  "pt": "A ligação é segura",
  "fr": "La connexion est sécurisée",
  "uk": "З’єднання захищене"
 },
 "Local page": {
  "tr": "Yerel sayfa",
  "es": "Página local",
  "pt": "Página local",
  "fr": "Page locale",
  "uk": "Локальна сторінка"
 },
 "1 cookie": {
  "tr": "1 çerez",
  "es": "1 cookie",
  "pt": "1 cookie",
  "fr": "1 cookie",
  "uk": "1 файл cookie"
 },
 "{n} cookies": {
  "tr": "{n} çerez",
  "es": "{n} cookies",
  "pt": "{n} cookies",
  "fr": "{n} cookies",
  "uk": "Файлів cookie: {n}"
 },
 "Click parts of the page to hide them": {
  "tr": "Gizlemek için sayfanın bölümlerine tıkla",
  "es": "Haz clic en partes de la página para ocultarlas",
  "pt": "Clique em partes da página para as ocultar",
  "fr": "Cliquez sur des parties de la page pour les masquer",
  "uk": "Натисніть частини сторінки, щоб сховати їх"
 },
 "MIDI devices": {
  "tr": "MIDI aygıtları",
  "es": "Dispositivos MIDI",
  "pt": "Dispositivos MIDI",
  "fr": "Appareils MIDI",
  "uk": "MIDI-пристрої"
 },
 "Input device": {
  "tr": "Giriş aygıtı",
  "es": "Dispositivo de entrada",
  "pt": "Dispositivo de entrada",
  "fr": "Périphérique d’entrée",
  "uk": "Пристрій введення"
 },
 "USB device": {
  "tr": "USB aygıtı",
  "es": "Dispositivo USB",
  "pt": "Dispositivo USB",
  "fr": "Appareil USB",
  "uk": "USB-пристрій"
 },
 "Serial port": {
  "tr": "Seri bağlantı noktası",
  "es": "Puerto serie",
  "pt": "Porta série",
  "fr": "Port série",
  "uk": "Послідовний порт"
 },
 "Bluetooth device": {
  "tr": "Bluetooth aygıtı",
  "es": "Dispositivo Bluetooth",
  "pt": "Dispositivo Bluetooth",
  "fr": "Appareil Bluetooth",
  "uk": "Bluetooth-пристрій"
 },
 "Device": {
  "tr": "Aygıt",
  "es": "Dispositivo",
  "pt": "Dispositivo",
  "fr": "Appareil",
  "uk": "Пристрій"
 },
 "Let sites ask to connect to devices": {
  "tr": "Sitelerin aygıtlara bağlanmak için sormasına izin ver",
  "es": "Permitir que los sitios pidan conectarse a dispositivos",
  "pt": "Permitir que os sites peçam para se ligar a dispositivos",
  "fr": "Autoriser les sites à demander l’accès aux appareils",
  "uk": "Дозволити сайтам просити під’єднання до пристроїв"
 },
 "Keyboard and mouse configurators, controllers, microcontrollers and other USB, serial and Bluetooth devices. You choose each device; Private never gets one.": {
  "tr": "Klavye ve fare yapılandırıcıları, oyun kumandaları, mikrodenetleyiciler ve diğer USB, seri ve Bluetooth aygıtları. Her aygıtı sen seçersin; Gizli hiçbirini almaz.",
  "es": "Configuradores de teclado y ratón, mandos, microcontroladores y otros dispositivos USB, serie y Bluetooth. Tú eliges cada dispositivo; Privado nunca recibe ninguno.",
  "pt": "Configuradores de teclado e rato, comandos, microcontroladores e outros dispositivos USB, série e Bluetooth. Escolhe cada dispositivo; o Privado nunca recebe nenhum.",
  "fr": "Configurateurs de clavier et de souris, manettes, microcontrôleurs et autres appareils USB, série et Bluetooth. Vous choisissez chaque appareil ; Privé n’en reçoit jamais.",
  "uk": "Конфігуратори клавіатур і мишей, контролери, мікроконтролери та інші USB-, послідовні й Bluetooth-пристрої. Ви обираєте кожен пристрій; Приватний режим не отримує жодного."
 },
 "{site} wants to use {what}": {
  "tr": "{site}, {what} kullanmak istiyor",
  "es": "{site} quiere usar {what}",
  "pt": "{site} quer usar {what}",
  "fr": "{site} souhaite utiliser {what}",
  "uk": "{site} хоче використовувати {what}"
 },
 " and ": {
  "tr": " ve ",
  "es": " y ",
  "pt": " e ",
  "fr": " et ",
  "uk": " і "
 },
 "your camera": {
  "tr": "kameranı",
  "es": "tu cámara",
  "pt": "a sua câmara",
  "fr": "votre caméra",
  "uk": "вашу камеру"
 },
 "your microphone": {
  "tr": "mikrofonunu",
  "es": "tu micrófono",
  "pt": "o seu microfone",
  "fr": "votre micro",
  "uk": "ваш мікрофон"
 },
 "your location": {
  "tr": "konumunu",
  "es": "tu ubicación",
  "pt": "a sua localização",
  "fr": "votre position",
  "uk": "ваше розташування"
 },
 "show notifications": {
  "tr": "bildirim göstermeyi",
  "es": "mostrar notificaciones",
  "pt": "mostrar notificações",
  "fr": "afficher des notifications",
  "uk": "показ сповіщень"
 },
 "your clipboard": {
  "tr": "panonu",
  "es": "tu portapapeles",
  "pt": "a sua área de transferência",
  "fr": "votre presse-papiers",
  "uk": "ваш буфер обміну"
 },
 "your MIDI devices": {
  "tr": "MIDI aygıtlarını",
  "es": "tus dispositivos MIDI",
  "pt": "os seus dispositivos MIDI",
  "fr": "vos appareils MIDI",
  "uk": "ваші MIDI-пристрої"
 },
 "Your choice applies to this site in Personal and Work. macOS may require additional permission.": {
  "tr": "Seçimin bu site için Kişisel ve İş alanlarında geçerli olur. macOS ek izin isteyebilir.",
  "es": "Tu elección se aplica a este sitio en Personal y Trabajo. macOS puede pedir un permiso adicional.",
  "pt": "A sua escolha aplica-se a este site em Pessoal e Trabalho. O macOS pode pedir permissão adicional.",
  "fr": "Votre choix s’applique à ce site dans Personnel et Travail. macOS peut demander une autorisation supplémentaire.",
  "uk": "Ваш вибір діє для цього сайту в просторах Особисте й Робота. macOS може попросити додатковий дозвіл."
 },
 "Not now": {
  "tr": "Şimdi değil",
  "es": "Ahora no",
  "pt": "Agora não",
  "fr": "Pas maintenant",
  "uk": "Не зараз"
 },
 "{site} wants to connect to {what}": {
  "tr": "{site}, {what} bağlanmak istiyor",
  "es": "{site} quiere conectarse a {what}",
  "pt": "{site} quer ligar-se a {what}",
  "fr": "{site} souhaite se connecter à {what}",
  "uk": "{site} хоче під’єднатися до: {what}"
 },
 "a keyboard, mouse or other input device": {
  "tr": "bir klavyeye, fareye veya başka bir giriş aygıtına",
  "es": "un teclado, ratón u otro dispositivo de entrada",
  "pt": "um teclado, rato ou outro dispositivo de entrada",
  "fr": "un clavier, une souris ou un autre périphérique d’entrée",
  "uk": "клавіатура, миша або інший пристрій введення"
 },
 "a USB device": {
  "tr": "bir USB aygıtına",
  "es": "un dispositivo USB",
  "pt": "um dispositivo USB",
  "fr": "un appareil USB",
  "uk": "USB-пристрій"
 },
 "a serial port": {
  "tr": "bir seri bağlantı noktasına",
  "es": "un puerto serie",
  "pt": "uma porta série",
  "fr": "un port série",
  "uk": "послідовний порт"
 },
 "a Bluetooth device": {
  "tr": "bir Bluetooth aygıtına",
  "es": "un dispositivo Bluetooth",
  "pt": "um dispositivo Bluetooth",
  "fr": "un appareil Bluetooth",
  "uk": "Bluetooth-пристрій"
 },
 "No compatible devices found. Plug the device in (or turn it on) and try again.": {
  "tr": "Uyumlu aygıt bulunamadı. Aygıtı tak (veya aç) ve yeniden dene.",
  "es": "No se encontraron dispositivos compatibles. Conecta (o enciende) el dispositivo e inténtalo de nuevo.",
  "pt": "Não foram encontrados dispositivos compatíveis. Ligue o dispositivo e tente novamente.",
  "fr": "Aucun appareil compatible trouvé. Branchez (ou allumez) l’appareil et réessayez.",
  "uk": "Сумісних пристроїв не знайдено. Під’єднайте (або увімкніть) пристрій і спробуйте ще раз."
 },
 "No compatible devices found. Plug the device in (or turn it on) and try again. Prism needs Bluetooth access in System Settings → Privacy & Security.": {
  "tr": "Uyumlu aygıt bulunamadı. Aygıtı aç ve yeniden dene. Prism, Sistem Ayarları → Gizlilik ve Güvenlik'te Bluetooth erişimine ihtiyaç duyar.",
  "es": "No se encontraron dispositivos compatibles. Enciende el dispositivo e inténtalo de nuevo. Prism necesita acceso a Bluetooth en Ajustes del Sistema → Privacidad y seguridad.",
  "pt": "Não foram encontrados dispositivos compatíveis. Ligue o dispositivo e tente novamente. O Prism precisa de acesso ao Bluetooth em Definições do Sistema → Privacidade e segurança.",
  "fr": "Aucun appareil compatible trouvé. Allumez l’appareil et réessayez. Prism a besoin de l’accès Bluetooth dans Réglages Système → Confidentialité et sécurité.",
  "uk": "Сумісних пристроїв не знайдено. Увімкніть пристрій і спробуйте ще раз. Prism потребує доступу до Bluetooth у Системних параметрах → Приватність і безпека."
 },
 "Choose a device. The site can use it until you remove it in its site settings.": {
  "tr": "Bir aygıt seç. Site, onu site ayarlarından kaldırana kadar kullanabilir.",
  "es": "Elige un dispositivo. El sitio podrá usarlo hasta que lo quites en sus ajustes.",
  "pt": "Escolha um dispositivo. O site pode usá-lo até o remover nas definições do site.",
  "fr": "Choisissez un appareil. Le site peut l’utiliser jusqu’à ce que vous le retiriez de ses réglages.",
  "uk": "Виберіть пристрій. Сайт зможе ним користуватися, доки ви не вилучите його в налаштуваннях сайту."
 },
 "{site} wants to share your screen": {
  "tr": "{site} ekranını paylaşmak istiyor",
  "es": "{site} quiere compartir tu pantalla",
  "pt": "{site} quer partilhar o seu ecrã",
  "fr": "{site} souhaite partager votre écran",
  "uk": "{site} хоче показати ваш екран"
 },
 "Choose what to share.": {
  "tr": "Neyi paylaşacağını seç.",
  "es": "Elige qué compartir.",
  "pt": "Escolha o que partilhar.",
  "fr": "Choisissez ce que vous partagez.",
  "uk": "Виберіть, що показати."
 },
 "Entire screen": {
  "tr": "Tüm ekran",
  "es": "Pantalla completa",
  "pt": "Ecrã inteiro",
  "fr": "Écran entier",
  "uk": "Увесь екран"
 },
 "Sign in to {site}": {
  "tr": "{site} sitesine giriş yap",
  "es": "Iniciar sesión en {site}",
  "pt": "Iniciar sessão em {site}",
  "fr": "Se connecter à {site}",
  "uk": "Увійти на {site}"
 },
 "The site says: “{realm}”": {
  "tr": "Site diyor ki: “{realm}”",
  "es": "El sitio dice: “{realm}”",
  "pt": "O site diz: “{realm}”",
  "fr": "Le site indique : « {realm} »",
  "uk": "Сайт повідомляє: «{realm}»"
 },
 "This site needs a user name and password.": {
  "tr": "Bu site bir kullanıcı adı ve parola istiyor.",
  "es": "Este sitio necesita un nombre de usuario y una contraseña.",
  "pt": "Este site precisa de um nome de utilizador e palavra-passe.",
  "fr": "Ce site demande un nom d’utilisateur et un mot de passe.",
  "uk": "Цей сайт потребує ім’я користувача й пароль."
 },
 "Your password is sent without encryption.": {
  "tr": "Parolan şifrelenmeden gönderilir.",
  "es": "Tu contraseña se envía sin cifrar.",
  "pt": "A sua palavra-passe é enviada sem encriptação.",
  "fr": "Votre mot de passe est envoyé sans chiffrement.",
  "uk": "Ваш пароль надсилається без шифрування."
 },
 "User name": {
  "tr": "Kullanıcı adı",
  "es": "Nombre de usuario",
  "pt": "Nome de utilizador",
  "fr": "Nom d’utilisateur",
  "uk": "Ім’я користувача"
 },
 "Sign In": {
  "tr": "Giriş Yap",
  "es": "Iniciar sesión",
  "pt": "Iniciar sessão",
  "fr": "Se connecter",
  "uk": "Увійти"
 },
 "Save Page As…": {
  "tr": "Sayfayı Farklı Kaydet…",
  "es": "Guardar página como…",
  "pt": "Guardar página como…",
  "fr": "Enregistrer la page sous…",
  "uk": "Зберегти сторінку як…"
 },
 "Print…": {
  "tr": "Yazdır…",
  "es": "Imprimir…",
  "pt": "Imprimir…",
  "fr": "Imprimer…",
  "uk": "Друкувати…"
 },
 "Web page, complete": {
  "tr": "Web sayfası, tamamı",
  "es": "Página web completa",
  "pt": "Página Web completa",
  "fr": "Page web complète",
  "uk": "Вебсторінка повністю"
 },
 "Page saved": {
  "tr": "Sayfa kaydedildi",
  "es": "Página guardada",
  "pt": "Página guardada",
  "fr": "Page enregistrée",
  "uk": "Сторінку збережено"
 },
 "No extensions turned on": {
  "tr": "Açık uzantı yok",
  "es": "No hay extensiones activadas",
  "pt": "Nenhuma extensão ativada",
  "fr": "Aucune extension activée",
  "uk": "Немає увімкнених розширень"
 },
 "Turned-on extensions appear here.": {
  "tr": "Açık uzantılar burada görünür.",
  "es": "Las extensiones activadas aparecen aquí.",
  "pt": "As extensões ativadas aparecem aqui.",
  "fr": "Les extensions activées apparaissent ici.",
  "uk": "Тут з’являються увімкнені розширення."
 },
 "Manage extensions": {
  "tr": "Uzantıları yönet",
  "es": "Gestionar extensiones",
  "pt": "Gerir extensões",
  "fr": "Gérer les extensions",
  "uk": "Керувати розширеннями"
 },
 "Remove from Prism…": {
  "tr": "Prism'den kaldır…",
  "es": "Quitar de Prism…",
  "pt": "Remover do Prism…",
  "fr": "Retirer de Prism…",
  "uk": "Вилучити з Prism…"
 },
 "Remove “{name}”?": {
  "tr": "“{name}” kaldırılsın mı?",
  "es": "¿Quitar “{name}”?",
  "pt": "Remover “{name}”?",
  "fr": "Retirer « {name} » ?",
  "uk": "Вилучити «{name}»?"
 },
 "Recently visited": {
  "tr": "Son ziyaret edilen",
  "es": "Visitado recientemente",
  "pt": "Visitado recentemente",
  "fr": "Consulté récemment",
  "uk": "Нещодавно відвідані"
 },
 "Allow {name} more access?": {
  "tr": "{name} için daha fazla erişime izin verilsin mi?",
  "es": "¿Permitir más acceso a {name}?",
  "pt": "Permitir mais acesso a {name}?",
  "fr": "Autoriser plus d’accès à {name} ?",
  "uk": "Дозволити {name} більше доступу?"
 },
 "Don’t Allow": {
  "tr": "İzin Verme",
  "es": "No permitir",
  "pt": "Não permitir",
  "fr": "Ne pas autoriser",
  "uk": "Не дозволяти"
 },
 "Reader": {
  "tr": "Okuyucu",
  "es": "Lector",
  "pt": "Leitor",
  "fr": "Lecteur",
  "uk": "Читач"
 },
 "{n} min read": {
  "tr": "{n} dk okuma",
  "es": "{n} min de lectura",
  "pt": "{n} min de leitura",
  "fr": "{n} min de lecture",
  "uk": "{n} хв читання"
 },
 "Smaller text": {
  "tr": "Daha küçük yazı",
  "es": "Texto más pequeño",
  "pt": "Texto menor",
  "fr": "Texte plus petit",
  "uk": "Менший текст"
 },
 "Larger text": {
  "tr": "Daha büyük yazı",
  "es": "Texto más grande",
  "pt": "Texto maior",
  "fr": "Texte plus grand",
  "uk": "Більший текст"
 },
 "Reader appearance": {
  "tr": "Okuyucu görünümü",
  "es": "Apariencia del lector",
  "pt": "Aparência do Leitor",
  "fr": "Apparence du lecteur",
  "uk": "Вигляд читача"
 },
 "Font": {
  "tr": "Yazı tipi",
  "es": "Tipo de letra",
  "pt": "Fonte",
  "fr": "Police",
  "uk": "Шрифт"
 },
 "Line width": {
  "tr": "Satır genişliği",
  "es": "Ancho de línea",
  "pt": "Largura da linha",
  "fr": "Largeur de ligne",
  "uk": "Ширина рядка"
 },
 "Auto": {
  "tr": "Otomatik",
  "es": "Automático",
  "pt": "Automático",
  "fr": "Auto",
  "uk": "Авто"
 },
 "White": {
  "tr": "Beyaz",
  "es": "Blanco",
  "pt": "Branco",
  "fr": "Blanc",
  "uk": "Білий"
 },
 "Sepia": {
  "tr": "Sepya",
  "es": "Sepia",
  "pt": "Sépia",
  "fr": "Sépia",
  "uk": "Сепія"
 },
 "Gray": {
  "tr": "Gri",
  "es": "Gris",
  "pt": "Cinza",
  "fr": "Gris",
  "uk": "Сірий"
 },
 "Night": {
  "tr": "Gece",
  "es": "Noche",
  "pt": "Noite",
  "fr": "Nuit",
  "uk": "Ніч"
 },
 "Narrow": {
  "tr": "Dar",
  "es": "Estrecho",
  "pt": "Estreito",
  "fr": "Étroit",
  "uk": "Вузько"
 },
 "Normal": {
  "tr": "Normal",
  "es": "Normal",
  "pt": "Normal",
  "fr": "Normal",
  "uk": "Звичайно"
 },
 "Wide": {
  "tr": "Geniş",
  "es": "Ancho",
  "pt": "Largo",
  "fr": "Large",
  "uk": "Широко"
 },
 "Show Reader": {
  "tr": "Okuyucuyu Göster",
  "es": "Mostrar lector",
  "pt": "Mostrar Leitor",
  "fr": "Afficher le lecteur",
  "uk": "Показати читач"
 },
 "Hide Reader": {
  "tr": "Okuyucuyu Gizle",
  "es": "Ocultar lector",
  "pt": "Ocultar Leitor",
  "fr": "Masquer le lecteur",
  "uk": "Сховати читач"
 },
 "Reader isn’t available for this page.": {
  "tr": "Okuyucu bu sayfada kullanılamıyor.",
  "es": "El lector no está disponible para esta página.",
  "pt": "O Leitor não está disponível para esta página.",
  "fr": "Le lecteur n’est pas disponible pour cette page.",
  "uk": "Читач недоступний для цієї сторінки."
 },
 "Reader closed.": {
  "tr": "Okuyucu kapatıldı.",
  "es": "Lector cerrado.",
  "pt": "Leitor fechado.",
  "fr": "Lecteur fermé.",
  "uk": "Читач закрито."
 },
 "Add to Dock…": {
  "tr": "Dock’a Ekle…",
  "es": "Añadir al Dock…",
  "pt": "Adicionar ao Dock…",
  "fr": "Ajouter au Dock…",
  "uk": "Додати в Dock…"
 },
 "Open a website first.": {
  "tr": "Önce bir web sitesi açın.",
  "es": "Abre un sitio web primero.",
  "pt": "Abra um site primeiro.",
  "fr": "Ouvrez d’abord un site web.",
  "uk": "Спершу відкрийте вебсайт."
 },
 "Private pages can’t be added to the Dock.": {
  "tr": "Gizli sayfalar Dock’a eklenemez.",
  "es": "Las páginas privadas no se pueden añadir al Dock.",
  "pt": "Páginas privadas não podem ser adicionadas ao Dock.",
  "fr": "Les pages privées ne peuvent pas être ajoutées au Dock.",
  "uk": "Приватні сторінки не можна додати в Dock."
 },
 "Web apps need macOS.": {
  "tr": "Web uygulamaları macOS gerektirir.",
  "es": "Las apps web necesitan macOS.",
  "pt": "Apps da web precisam do macOS.",
  "fr": "Les apps web nécessitent macOS.",
  "uk": "Вебпрограмам потрібна macOS."
 },
 "Couldn’t add this site to the Dock.": {
  "tr": "Bu site Dock’a eklenemedi.",
  "es": "No se pudo añadir este sitio al Dock.",
  "pt": "Não foi possível adicionar este site ao Dock.",
  "fr": "Impossible d’ajouter ce site au Dock.",
  "uk": "Не вдалося додати цей сайт у Dock."
 },
 "{name} is in your Applications folder. To keep it in the Dock, right-click its icon and choose Options → Keep in Dock.": {
  "tr": "{name} Uygulamalar klasörünüzde. Dock’ta tutmak için simgesine sağ tıklayıp Seçenekler → Dock’ta Tut’u seçin.",
  "es": "{name} está en tu carpeta Aplicaciones. Para mantenerla en el Dock, haz clic derecho en su icono y elige Opciones → Mantener en el Dock.",
  "pt": "{name} está na sua pasta Aplicativos. Para mantê-lo no Dock, clique com o botão direito no ícone e escolha Opções → Manter no Dock.",
  "fr": "{name} se trouve dans votre dossier Applications. Pour la garder dans le Dock, faites un clic droit sur son icône et choisissez Options → Garder dans le Dock.",
  "uk": "{name} у вашій папці «Програми». Щоб залишити її в Dock, клацніть правою кнопкою на іконці й виберіть Параметри → Залишити в Dock."
 },
 "New Lens Window": {
  "tr": "Yeni Lens Penceresi",
  "es": "Nueva ventana de Lens",
  "pt": "Nova janela do Lens",
  "fr": "Nouvelle fenêtre Lens",
  "uk": "Нове вікно Lens"
 },
 "New Lens window": {
  "tr": "Yeni Lens penceresi",
  "es": "Nueva ventana de Lens",
  "pt": "Nova janela do Lens",
  "fr": "Nouvelle fenêtre Lens",
  "uk": "Нове вікно Lens"
 },
 "Tidy Tabs": {
  "tr": "Sekmeleri Topla",
  "es": "Ordenar pestañas",
  "pt": "Arrumar abas",
  "fr": "Ranger les onglets",
  "uk": "Прибрати вкладки"
 },
 "Tidy tabs": {
  "tr": "Sekmeleri topla",
  "es": "Ordenar pestañas",
  "pt": "Arrumar abas",
  "fr": "Ranger les onglets",
  "uk": "Прибрати вкладки"
 },
 "Tidied {n} tabs": {
  "tr": "{n} sekme toplandı",
  "es": "{n} pestañas ordenadas",
  "pt": "{n} abas arrumadas",
  "fr": "{n} onglets rangés",
  "uk": "Прибрано вкладок: {n}"
 },
 "Nothing to tidy: every tab here was used in the last half hour.": {
  "tr": "Toplanacak bir şey yok: buradaki her sekme son yarım saatte kullanıldı.",
  "es": "Nada que ordenar: todas las pestañas se usaron en la última media hora.",
  "pt": "Nada para arrumar: todas as abas foram usadas na última meia hora.",
  "fr": "Rien à ranger : chaque onglet a servi dans la dernière demi-heure.",
  "uk": "Нічого прибирати: кожну вкладку тут використано за останні пів години."
 },
 "Show Me Around": {
  "tr": "Bana Etrafı Göster",
  "es": "Hacer un recorrido",
  "pt": "Fazer um tour",
  "fr": "Faire le tour",
  "uk": "Показати, що де"
 },
 "Show me around": {
  "tr": "Bana etrafı göster",
  "es": "Hacer un recorrido",
  "pt": "Fazer um tour",
  "fr": "Faire le tour",
  "uk": "Показати, що де"
 },
 "Copied": {
  "tr": "Kopyalandı",
  "es": "Copiado",
  "pt": "Copiado",
  "fr": "Copié",
  "uk": "Скопійовано"
 },
 "Search or enter address": {
  "tr": "Ara veya adres gir",
  "es": "Busca o escribe una dirección",
  "pt": "Pesquise ou digite um endereço",
  "fr": "Rechercher ou saisir une adresse",
  "uk": "Шукайте або введіть адресу"
 },
 "Type an address or a search, then press Return.": {
  "tr": "Bir adres ya da arama yazıp Return'e basın.",
  "es": "Escribe una dirección o una búsqueda y pulsa Intro.",
  "pt": "Digite um endereço ou uma pesquisa e pressione Return.",
  "fr": "Saisissez une adresse ou une recherche, puis appuyez sur Entrée.",
  "uk": "Введіть адресу або запит і натисніть Return."
 },
 "Keep open": {
  "tr": "Açık tut",
  "es": "Mantener abierto",
  "pt": "Manter aberto",
  "fr": "Garder ouvert",
  "uk": "Залишити відкритим"
 },
 "Keep open in a Lens window": {
  "tr": "Bir Lens penceresinde açık tut",
  "es": "Mantener abierto en una ventana de Lens",
  "pt": "Manter aberto numa janela do Lens",
  "fr": "Garder ouvert dans une fenêtre Lens",
  "uk": "Залишити відкритим у вікні Lens"
 },
 "Copy link": {
  "tr": "Bağlantıyı kopyala",
  "es": "Copiar enlace",
  "pt": "Copiar link",
  "fr": "Copier le lien",
  "uk": "Копіювати посилання"
 },
 "Copy link (⇧⌘C)": {
  "tr": "Bağlantıyı kopyala (⇧⌘C)",
  "es": "Copiar enlace (⇧⌘C)",
  "pt": "Copiar link (⇧⌘C)",
  "fr": "Copier le lien (⇧⌘C)",
  "uk": "Копіювати посилання (⇧⌘C)"
 },
 "Open as tab (⌘↩)": {
  "tr": "Sekme olarak aç (⌘↩)",
  "es": "Abrir como pestaña (⌘↩)",
  "pt": "Abrir como aba (⌘↩)",
  "fr": "Ouvrir dans un onglet (⌘↩)",
  "uk": "Відкрити як вкладку (⌘↩)"
 },
 "Stop": {
  "tr": "Durdur",
  "es": "Detener",
  "pt": "Parar",
  "fr": "Arrêter",
  "uk": "Зупинити"
 },
 "Back (⌘[)": {
  "tr": "Geri (⌘[)",
  "es": "Atrás (⌘[)",
  "pt": "Voltar (⌘[)",
  "fr": "Précédent (⌘[)",
  "uk": "Назад (⌘[)"
 },
 "Forward (⌘])": {
  "tr": "İleri (⌘])",
  "es": "Adelante (⌘])",
  "pt": "Avançar (⌘])",
  "fr": "Suivant (⌘])",
  "uk": "Вперед (⌘])"
 },
 "Close (Esc)": {
  "tr": "Kapat (Esc)",
  "es": "Cerrar (Esc)",
  "pt": "Fechar (Esc)",
  "fr": "Fermer (Échap)",
  "uk": "Закрити (Esc)"
 },
 "Open links from other apps in Lens": {
  "tr": "Diğer uygulamalardaki bağlantıları Lens'te aç",
  "es": "Abrir enlaces de otras apps en Lens",
  "pt": "Abrir links de outros apps no Lens",
  "fr": "Ouvrir les liens des autres apps dans Lens",
  "uk": "Відкривати посилання з інших програм у Lens"
 },
 "Links from Mail, Slack and other apps open in a small Lens window instead of a new tab (⌥⌘N opens one anytime).": {
  "tr": "Mail, Slack ve diğer uygulamalardan gelen bağlantılar yeni sekme yerine küçük bir Lens penceresinde açılır (⌥⌘N istediğiniz an bir tane açar).",
  "es": "Los enlaces de Mail, Slack y otras apps se abren en una pequeña ventana de Lens en lugar de una pestaña nueva (⌥⌘N abre una cuando quieras).",
  "pt": "Links do Mail, Slack e outros apps abrem numa pequena janela do Lens em vez de uma nova aba (⌥⌘N abre uma a qualquer momento).",
  "fr": "Les liens de Mail, Slack et d'autres apps s'ouvrent dans une petite fenêtre Lens au lieu d'un nouvel onglet (⌥⌘N en ouvre une à tout moment).",
  "uk": "Посилання з Mail, Slack та інших програм відкриваються в маленькому вікні Lens замість нової вкладки (⌥⌘N відкриває його будь-коли)."
 },
 "{n} of {total}": {
  "tr": "{n} / {total}",
  "es": "{n} de {total}",
  "pt": "{n} de {total}",
  "fr": "{n} sur {total}",
  "uk": "{n} з {total}"
 },
 "Next": {
  "tr": "İleri",
  "es": "Siguiente",
  "pt": "Próximo",
  "fr": "Suivant",
  "uk": "Далі"
 },
 "Type an address or a search. On an article, Reader shows just the story.": {
  "tr": "Bir adres ya da arama yazın. Bir makalede Okuyucu yalnızca yazıyı gösterir.",
  "es": "Escribe una dirección o una búsqueda. En un artículo, el Lector muestra solo la historia.",
  "pt": "Digite um endereço ou uma pesquisa. Num artigo, o Leitor mostra só o texto.",
  "fr": "Saisissez une adresse ou une recherche. Sur un article, le Lecteur n'affiche que le texte.",
  "uk": "Введіть адресу або запит. На статті Читач показує лише текст."
 },
 "Site controls and Prism Shield": {
  "tr": "Site denetimleri ve Prism Shield",
  "es": "Controles del sitio y Prism Shield",
  "pt": "Controles do site e Prism Shield",
  "fr": "Réglages du site et Prism Shield",
  "uk": "Налаштування сайту та Prism Shield"
 },
 "See what Prism Shield blocked on this site, and set its permissions, zoom and more.": {
  "tr": "Prism Shield'ın bu sitede neyi engellediğini görün; izinleri, yakınlaştırmayı ve fazlasını ayarlayın.",
  "es": "Mira qué bloqueó Prism Shield en este sitio y ajusta sus permisos, el zoom y más.",
  "pt": "Veja o que o Prism Shield bloqueou neste site e ajuste permissões, zoom e mais.",
  "fr": "Voyez ce que Prism Shield a bloqué sur ce site, et réglez ses autorisations, le zoom et plus encore.",
  "uk": "Перегляньте, що Prism Shield заблокував на цьому сайті, і налаштуйте дозволи, масштаб тощо."
 },
 "Open a page, find any tab, setting or action, or type a sum to get the answer.": {
  "tr": "Bir sayfa açın, herhangi bir sekme, ayar ya da eylemi bulun veya sonucu almak için bir işlem yazın.",
  "es": "Abre una página, encuentra cualquier pestaña, ajuste o acción, o escribe una operación para ver el resultado.",
  "pt": "Abra uma página, encontre qualquer aba, ajuste ou ação, ou digite uma conta para ver o resultado.",
  "fr": "Ouvrez une page, trouvez un onglet, un réglage ou une action, ou tapez un calcul pour avoir le résultat.",
  "uk": "Відкрийте сторінку, знайдіть будь-яку вкладку, налаштування чи дію або введіть вираз, щоб отримати відповідь."
 },
 "Favorites": {
  "tr": "Favoriler",
  "es": "Favoritos",
  "pt": "Favoritos",
  "fr": "Favoris",
  "uk": "Обране"
 },
 "Your everyday sites, one click away. Drag a tab here to add it.": {
  "tr": "Her gün kullandığınız siteler bir tık uzağınızda. Eklemek için bir sekmeyi buraya sürükleyin.",
  "es": "Tus sitios de cada día, a un clic. Arrastra una pestaña aquí para añadirla.",
  "pt": "Seus sites do dia a dia, a um clique. Arraste uma aba para cá para adicioná-la.",
  "fr": "Vos sites de tous les jours, à un clic. Faites glisser un onglet ici pour l'ajouter.",
  "uk": "Ваші щоденні сайти за один клік. Перетягніть сюди вкладку, щоб додати її."
 },
 "Tabs": {
  "tr": "Sekmeler",
  "es": "Pestañas",
  "pt": "Abas",
  "fr": "Onglets",
  "uk": "Вкладки"
 },
 "Idle tabs sleep to save memory. Tidy tabs archives the ones you haven’t used in half an hour, and Undo brings them back.": {
  "tr": "Boştaki sekmeler bellek kazanmak için uyur. Sekmeleri topla, yarım saattir kullanmadıklarınızı arşivler; Geri al onları geri getirir.",
  "es": "Las pestañas inactivas se duermen para ahorrar memoria. Ordenar pestañas archiva las que no usas desde hace media hora, y Deshacer las recupera.",
  "pt": "Abas paradas dormem para poupar memória. Arrumar abas arquiva as que você não usa há meia hora, e Desfazer as traz de volta.",
  "fr": "Les onglets inactifs dorment pour économiser la mémoire. Ranger les onglets archive ceux que vous n'avez pas utilisés depuis une demi-heure, et Annuler les ramène.",
  "uk": "Неактивні вкладки засинають, щоб заощадити пам'ять. «Прибрати вкладки» архівує ті, якими ви не користувалися пів години, а «Скасувати» повертає їх."
 },
 "Keep work and life apart, each with its own tabs and colors. Swipe with two fingers in the sidebar to switch.": {
  "tr": "İşi ve hayatı ayrı tutun; her birinin kendi sekmeleri ve renkleri olsun. Geçiş için kenar çubuğunda iki parmakla kaydırın.",
  "es": "Separa el trabajo y la vida, cada uno con sus pestañas y colores. Desliza con dos dedos en la barra lateral para cambiar.",
  "pt": "Separe trabalho e vida pessoal, cada um com suas abas e cores. Deslize com dois dedos na barra lateral para trocar.",
  "fr": "Séparez travail et vie perso, chacun avec ses onglets et ses couleurs. Balayez à deux doigts dans la barre latérale pour passer de l'un à l'autre.",
  "uk": "Тримайте роботу й особисте окремо, кожне зі своїми вкладками та кольорами. Проведіть двома пальцями на бічній панелі, щоб перемкнути."
 },
 "Lens": {
  "tr": "Lens",
  "es": "Lens",
  "pt": "Lens",
  "fr": "Lens",
  "uk": "Lens"
 },
 "Shift-click a link to peek at it without leaving the page. Keep open turns it into a small quick browser, and ⌥⌘N opens a new one.": {
  "tr": "Sayfadan ayrılmadan göz atmak için bir bağlantıya Shift ile tıklayın. Açık tut onu küçük, hızlı bir tarayıcıya çevirir; ⌥⌘N yenisini açar.",
  "es": "Haz clic con Mayúsculas en un enlace para verlo sin salir de la página. Mantener abierto lo convierte en un pequeño navegador rápido, y ⌥⌘N abre uno nuevo.",
  "pt": "Clique com Shift num link para espiar sem sair da página. Manter aberto o transforma num pequeno navegador rápido, e ⌥⌘N abre um novo.",
  "fr": "Cliquez sur un lien avec Maj pour le voir sans quitter la page. Garder ouvert en fait un petit navigateur rapide, et ⌥⌘N en ouvre un nouveau.",
  "uk": "Клацніть посилання з Shift, щоб переглянути його, не залишаючи сторінку. «Залишити відкритим» робить його маленьким швидким браузером, а ⌥⌘N відкриває новий."
 },
 "Add Chrome extensions and reach them here.": {
  "tr": "Chrome uzantıları ekleyin ve onlara buradan ulaşın.",
  "es": "Añade extensiones de Chrome y accede a ellas aquí.",
  "pt": "Adicione extensões do Chrome e acesse-as aqui.",
  "fr": "Ajoutez des extensions Chrome et retrouvez-les ici.",
  "uk": "Додавайте розширення Chrome і відкривайте їх тут."
 },
 "Files you download appear here. Drag one straight into another app.": {
  "tr": "İndirdiğiniz dosyalar burada görünür. Birini doğrudan başka bir uygulamaya sürükleyin.",
  "es": "Tus descargas aparecen aquí. Arrastra una directamente a otra app.",
  "pt": "Seus downloads aparecem aqui. Arraste um direto para outro app.",
  "fr": "Vos fichiers téléchargés apparaissent ici. Faites-en glisser un directement dans une autre app.",
  "uk": "Завантажені файли з'являються тут. Перетягніть файл просто в іншу програму."
 },
 "Make Prism yours. To keep a site in the Dock as its own app, choose File → Add to Dock. Help → Show Me Around brings this tour back.": {
  "tr": "Prism'i kendinize göre ayarlayın. Bir siteyi kendi uygulaması olarak Dock'ta tutmak için Dosya → Dock'a Ekle'yi seçin. Yardım → Bana Etrafı Göster bu turu yeniden açar.",
  "es": "Haz Prism tuyo. Para tener un sitio en el Dock como app propia, elige Archivo → Añadir al Dock. Ayuda → Hacer un recorrido vuelve a mostrar este recorrido.",
  "pt": "Deixe o Prism do seu jeito. Para manter um site no Dock como app próprio, escolha Arquivo → Adicionar ao Dock. Ajuda → Fazer um tour mostra este tour de novo.",
  "fr": "Personnalisez Prism. Pour garder un site dans le Dock comme une app, choisissez Fichier → Ajouter au Dock. Aide → Faire le tour relance cette visite.",
  "uk": "Налаштуйте Prism під себе. Щоб тримати сайт у Dock як окрему програму, виберіть Файл → Додати в Dock. Довідка → Показати, що де знову відкриє цей тур."
 },
 "Make the most": {
  "tr": "En iyisini çıkar",
  "es": "Sácale partido",
  "pt": "Aproveite ao máximo",
  "fr": "Tirer le meilleur",
  "uk": "Максимум можливостей"
 },
 "Make the most of Prism.": {
  "tr": "Prism'den en iyi şekilde yararlanın.",
  "es": "Saca el máximo partido a Prism.",
  "pt": "Aproveite o Prism ao máximo.",
  "fr": "Tirez le meilleur de Prism.",
  "uk": "Використовуйте Prism на повну."
 },
 "A few shortcuts that open up the rest.": {
  "tr": "Gerisini açan birkaç kısayol.",
  "es": "Unos atajos que abren todo lo demás.",
  "pt": "Alguns atalhos que abrem o resto.",
  "fr": "Quelques raccourcis qui ouvrent tout le reste.",
  "uk": "Кілька скорочень, що відкривають решту."
 },
 "Find tabs, settings and actions. Type a sum to get the answer.": {
  "tr": "Sekmeleri, ayarları ve eylemleri bulun. Sonucu almak için bir işlem yazın.",
  "es": "Encuentra pestañas, ajustes y acciones. Escribe una operación para ver el resultado.",
  "pt": "Encontre abas, ajustes e ações. Digite uma conta para ver o resultado.",
  "fr": "Trouvez onglets, réglages et actions. Tapez un calcul pour avoir le résultat.",
  "uk": "Знаходьте вкладки, налаштування й дії. Введіть вираз, щоб отримати відповідь."
 },
 "Peek at a link without leaving the page.": {
  "tr": "Sayfadan ayrılmadan bir bağlantıya göz atın.",
  "es": "Echa un vistazo a un enlace sin salir de la página.",
  "pt": "Espie um link sem sair da página.",
  "fr": "Jetez un œil à un lien sans quitter la page.",
  "uk": "Перегляньте посилання, не залишаючи сторінку."
 },
 "Lens window": {
  "tr": "Lens penceresi",
  "es": "Ventana de Lens",
  "pt": "Janela do Lens",
  "fr": "Fenêtre Lens",
  "uk": "Вікно Lens"
 },
 "A small quick browser that floats beside your work.": {
  "tr": "İşinizin yanında duran küçük, hızlı bir tarayıcı.",
  "es": "Un pequeño navegador rápido que flota junto a tu trabajo.",
  "pt": "Um pequeno navegador rápido que flutua ao lado do seu trabalho.",
  "fr": "Un petit navigateur rapide qui flotte à côté de votre travail.",
  "uk": "Маленький швидкий браузер, що плаває поруч із вашою роботою."
 },
 "Just the article, in clean type.": {
  "tr": "Yalnızca yazı, temiz bir yazı tipiyle.",
  "es": "Solo el artículo, con tipografía limpia.",
  "pt": "Só o artigo, com tipografia limpa.",
  "fr": "Juste l'article, dans une typographie soignée.",
  "uk": "Лише стаття, чистим шрифтом."
 },
 "Archive tabs you haven’t used in half an hour.": {
  "tr": "Yarım saattir kullanmadığınız sekmeleri arşivleyin.",
  "es": "Archiva las pestañas que no usas desde hace media hora.",
  "pt": "Arquive as abas que você não usa há meia hora.",
  "fr": "Archivez les onglets inutilisés depuis une demi-heure.",
  "uk": "Архівуйте вкладки, якими не користувалися пів години."
 },
 "A clean link, without tracking tags.": {
  "tr": "İzleme etiketleri olmadan temiz bir bağlantı.",
  "es": "Un enlace limpio, sin etiquetas de rastreo.",
  "pt": "Um link limpo, sem marcadores de rastreamento.",
  "fr": "Un lien propre, sans balises de suivi.",
  "uk": "Чисте посилання без міток стеження."
 },
 "Next, a short tour shows where everything lives. File → Add to Dock keeps any site in the Dock as its own app.": {
  "tr": "Sırada, her şeyin nerede olduğunu gösteren kısa bir tur var. Dosya → Dock'a Ekle, herhangi bir siteyi Dock'ta kendi uygulaması olarak tutar.",
  "es": "A continuación, un breve recorrido te muestra dónde está todo. Archivo → Añadir al Dock deja cualquier sitio en el Dock como app propia.",
  "pt": "Em seguida, um tour rápido mostra onde fica cada coisa. Arquivo → Adicionar ao Dock mantém qualquer site no Dock como app próprio.",
  "fr": "Ensuite, une courte visite montre où tout se trouve. Fichier → Ajouter au Dock garde n'importe quel site dans le Dock comme une app.",
  "uk": "Далі короткий тур покаже, що де. Файл → Додати в Dock тримає будь-який сайт у Dock як окрему програму."
 },
 "All profiles": {
  "tr": "Tüm profiller",
  "es": "Todos los perfiles",
  "pt": "Todos os perfis",
  "fr": "Tous les profils",
  "uk": "Усі профілі"
 },
 "All profiles (merge)": {
  "tr": "Tüm profiller (birleştir)",
  "es": "Todos los perfiles (combinar)",
  "pt": "Todos os perfis (juntar)",
  "fr": "Tous les profils (fusionner)",
  "uk": "Усі профілі (об'єднати)"
 },
 "Importing {name}…": {
  "tr": "{name} içe aktarılıyor…",
  "es": "Importando {name}…",
  "pt": "Importando {name}…",
  "fr": "Importation de {name}…",
  "uk": "Імпорт {name}…"
 },
 "Force click opens links in Lens": {
  "tr": "Güçlü tıklama bağlantıları Lens'te açar",
  "es": "El clic fuerte abre enlaces en Lens",
  "pt": "O clique forte abre links no Lens",
  "fr": "Le clic forcé ouvre les liens dans Lens",
  "uk": "Сильне натискання відкриває посилання в Lens"
 },
 "Press firmly on a link to preview it without leaving the page.": {
  "tr": "Sayfadan ayrılmadan önizlemek için bir bağlantıya güçlüce basın.",
  "es": "Pulsa con fuerza un enlace para previsualizarlo sin salir de la página.",
  "pt": "Pressione com força um link para pré-visualizá-lo sem sair da página.",
  "fr": "Appuyez fermement sur un lien pour l'aperçu sans quitter la page.",
  "uk": "Натисніть посилання сильніше, щоб переглянути його, не залишаючи сторінку."
 },
 "Move to Apple Passwords…": {
  "tr": "Apple Parolalar'a taşı…",
  "es": "Mover a Contraseñas de Apple…",
  "pt": "Mover para Senhas da Apple…",
  "fr": "Déplacer vers Mots de passe d'Apple…",
  "uk": "Перенести в Паролі Apple…"
 },
 "Use Apple Passwords in Prism…": {
  "tr": "Prism'de Apple Parolalar'ı kullan…",
  "es": "Usar Contraseñas de Apple en Prism…",
  "pt": "Usar Senhas da Apple no Prism…",
  "fr": "Utiliser Mots de passe d'Apple dans Prism…",
  "uk": "Використовувати Паролі Apple у Prism…"
 },
 "Finish in the Passwords app": {
  "tr": "Parolalar uygulamasında bitirin",
  "es": "Termina en la app Contraseñas",
  "pt": "Termine no app Senhas",
  "fr": "Terminez dans l'app Mots de passe",
  "uk": "Завершіть у програмі «Паролі»"
 },
 "In Passwords, choose File → Import Passwords… and pick “Prism Passwords for Apple Passwords.csv” in Downloads. The file holds readable passwords, so Prism deletes it in 10 minutes.": {
  "tr": "Parolalar'da Dosya → Parolaları İçe Aktar…'ı seçin ve İndirilenler'deki “Prism Passwords for Apple Passwords.csv” dosyasını seçin. Dosyada okunabilir parolalar olduğu için Prism onu 10 dakika içinde siler.",
  "es": "En Contraseñas, elige Archivo → Importar contraseñas… y selecciona “Prism Passwords for Apple Passwords.csv” en Descargas. El archivo contiene contraseñas legibles, así que Prism lo borra en 10 minutos.",
  "pt": "No Senhas, escolha Arquivo → Importar Senhas… e selecione “Prism Passwords for Apple Passwords.csv” em Downloads. O arquivo contém senhas legíveis, por isso o Prism o apaga em 10 minutos.",
  "fr": "Dans Mots de passe, choisissez Fichier → Importer des mots de passe… puis « Prism Passwords for Apple Passwords.csv » dans Téléchargements. Le fichier contient des mots de passe lisibles : Prism le supprime dans 10 minutes.",
  "uk": "У «Паролях» виберіть Файл → Імпортувати паролі… і файл «Prism Passwords for Apple Passwords.csv» у Завантаженнях. Файл містить паролі у відкритому вигляді, тому Prism видалить його за 10 хвилин."
 },
 "{n} logins are ready to import into Apple Passwords.": {
  "tr": "{n} giriş Apple Parolalar'a aktarılmaya hazır.",
  "es": "{n} inicios de sesión listos para importar en Contraseñas de Apple.",
  "pt": "{n} logins prontos para importar nas Senhas da Apple.",
  "fr": "{n} identifiants prêts à importer dans Mots de passe d'Apple.",
  "uk": "{n} входів готові до імпорту в Паролі Apple."
 },
 "There are no saved passwords to move.": {
  "tr": "Taşınacak kayıtlı parola yok.",
  "es": "No hay contraseñas guardadas para mover.",
  "pt": "Não há senhas salvas para mover.",
  "fr": "Aucun mot de passe enregistré à déplacer.",
  "uk": "Немає збережених паролів для перенесення."
 },
 "move your passwords to Apple Passwords": {
  "tr": "parolalarınızı Apple Parolalar'a taşıyın",
  "es": "mover tus contraseñas a Contraseñas de Apple",
  "pt": "mover suas senhas para as Senhas da Apple",
  "fr": "déplacer vos mots de passe vers Mots de passe d'Apple",
  "uk": "перенести ваші паролі в Паролі Apple"
 },
 "Not available in Private.": {
  "tr": "Gizli modda kullanılamaz.",
  "es": "No disponible en Privado.",
  "pt": "Indisponível no modo Privado.",
  "fr": "Indisponible en navigation privée.",
  "uk": "Недоступно в приватному режимі."
 }
};
const languages=["en","tr","es","pt","fr","uk"];
function translate(language,text){return catalog[text]?.[language]||text;}
const api={catalog,languages,translate};if(typeof module!=="undefined"&&module.exports)module.exports=api;else root.PrismLanguages=api;
})(globalThis);
