class User < ApplicationRecord
  has_one :account, as: :userable, dependent: :destroy
  has_many :workouts
end
