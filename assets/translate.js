function googleTranslateElementInit() {
  const fallback = document.getElementById('gt-fallback');
  if (fallback) fallback.style.display = 'none';
  new google.translate.TranslateElement(
    { pageLanguage: 'en', layout: google.translate.TranslateElement.InlineLayout.SIMPLE },
    'google_translate_element'
  );
}
