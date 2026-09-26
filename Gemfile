source "https://rubygems.org"

gem "jekyll", "~> 4.3"
gem "jekyll-feed", "~> 0.17"

# GitHub Pages builds your site automatically when you push —
# you don't need this Gemfile unless you want to preview locally with `bundle exec jekyll serve`.
group :jekyll_plugins do
  gem "jekyll-feed"
end

# Windows/JRuby compatibility (harmless to leave in on other platforms)
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end
gem "wdm", "~> 0.1.1", :platforms => [:mingw, :x64_mingw, :mswin]
