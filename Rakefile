require "rubygems"
require "yaml"

## -- Misc Configs -- ##
config_file     = File.join('.', '_config.yml')
config          = YAML.load_file(config_file)
site_dir        = "_site"    # site directory


#######################
# Working with Jekyll #
#######################

desc "Generate jekyll site"
task :generate do
  puts "## Generating Site with Jekyll"
  system "jekyll"
end

desc "Deploy jekyll site"
task :deploy do
  system "rm -rf #{site_dir}/.git"
  Dir.chdir(site_dir)
  
  system "touch .nojekyll"
  system "git init"
  system "git remote add github #{config['github']['repo_url']}"
  system "git add ."
  system 'git commit -m "+ Import site."'
  system "git push -f github master:master"
end
