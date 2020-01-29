require 'faker'
require 'securerandom'
 
 
(1..5).each do |n|
  trainer = Trainer.new
  name = Faker::Name.first_name
  email = Faker::Internet.email
  password = "123456"
  trainer.build_account(name: name, email: email, password: password)
  trainer.save
    trainer.programs.create(title:"chest_workout_#{n}")
end

(1..5).each do |user|
  user = User.new
  name = Faker::Name.first_name
  email = Faker::Internet.email
  password = "123456"
  user.build_account(name: name, email: email, password: password)
  user.save
end



