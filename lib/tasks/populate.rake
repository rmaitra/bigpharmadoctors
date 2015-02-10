namespace :db do
    desc "Fill database"
    task :populate => :environment do
        require 'populator'
        require 'faker'
        
        User.populate 50 do |user|
            user.name = Faker::Name.name
            user.email = Faker::Internet.email
            user.password = 'password'
            user.password_confirmation = 'password'
            user.admin = false
            Post.populate 1..5 do |post|
                post.user_id = user.id
                post.title = Populator.words(1..5).titleize
                post.content = Populator.sentences(2..10)
                post.created_at = 2.years.ago..Time.now
                post.updated_at = 2.years.ago..Time.now
            end
        end
    end
end
            