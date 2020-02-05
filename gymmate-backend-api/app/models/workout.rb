class Workout < ApplicationRecord
  belongs_to :program
  belongs_to :user
  has_many :completes
end
