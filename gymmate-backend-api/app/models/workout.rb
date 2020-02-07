class Workout < ApplicationRecord
  belongs_to :program
  belongs_to :user
  has_many :completes, dependent: :delete_all
end
