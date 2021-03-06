workers Integer(ENV['WEB_CONCURRENCY'] || 2)
threads_count = Integer(ENV['MAX_THREADS'] || 4)
threads threads_count, threads_count

preload_app!

rackup DefaultRackup
port ENV['PORT'] || 3000
environment ENV['RACK_ENV'] || 'development'

if ENV['APPLICATION_HOST'] == 'mapbiomas.org'
  bind "unix:///dados/apps/mapbiomas/tmp/sockets/puma.sock"
end

on_worker_boot do
  ActiveRecord::Base.establish_connection
end
